# -*- coding: utf-8 -*-
import sys
import collections
import csv
import fileinput
import linecache
import os
import importlib
import re
from optparse import OptionParser

# 테스트할 코드의 각 라인에 대한 정보를 담을 클래스
from sympy import subfactorial

class Line:
    def __init__(self, score=0.0, rank=0, text="", lineNo=0):
        self.score = score
        self.rank = rank
        self.text = text
        self.lineNo = lineNo

    def setScore(self, score):
        self.score = score

    def setRank(self, rank):
        self.rank = rank

    def setText(self, text):
        self.text = text

    def setLineNo(self, lineNo):
        self.lineNo = lineNo

    def __gt__(self, line2):
        return self.rank > line2.rank


# 각 변수에 파일이름 할당
def importFileNames():
    global testFileName
    global resultsFileName
    global funName
    f = open('importNames.csv', 'rb')
    reader = csv.reader(f)
    for row in reader:
        testFileName = row[0]   # mid.py
        resultsFileName = row[1]    # testCasesMid
    f.close()
    funName = os.path.splitext(testFileName)[0]  # mid.py -> mid
    outputFile = 'output.txt'


# 결과 파일 import 하는 것
# 문제 : P,F를 사용자가 직접 알려줘야 함
# testCaseResults 에 (testcase, P / F) 형태의 list 로 저장
def importResultsFile():
    # tarantula.py 파일 있는 경로 변경 or 같은 폴더 안에 파일 모아두면 됨
    # os.chdir('C:\\Users\\MSI\\PycharmProjects\\tarantula')    # 현재 디렉토리 변경
    module_name = testFileName.split('.')[0]
    module = importlib.import_module(module_name)
    my_method = getattr(module, module_name)

    global totalPassed
    global totalFailed
    with open(resultsFileName, 'r') as file:
        while True:
            line = file.readline()
            # print line
            # line 은 각 테스트케이스 변수
            try:
                numbers = tuple([int(num) for num in line.split(',')])
                tests.append(numbers)
            except ValueError:
                break
            test_output = my_method(*numbers)   # 실행결과 리턴값
            res.append(test_output)
            line2 = file.readline()
            # print line2
            # line2 는 각 테스트케이스 P/F or 예상결과

            expected = line2.strip('\n')
            exp.append(int(expected))

            # if line2 == 'F\n' or line2 == 'F':
            if int(line2) != test_output:
                totalFailed += 1
                results[numbers] = False
            # if line2 == 'P\n' or line2 == 'P':
            if int(line2) == test_output:
                totalPassed += 1
                results[numbers] = True
            testCaseResuts.append((line.rstrip(), line2.rstrip()))


# lineToTest 에 의심도를 받아 의심도 순위 정함
def rank(lineToTest):
    Ranks = {}
    count = 0
    rev = reversed(collections.OrderedDict(sorted(lineToTest.items())))
    for i in rev:
        count += len(lineToTest[i])
        for j in lineToTest[i]:
            Ranks[j] = count
    return Ranks


################################scores = 의심도 계산###################
def passfail(line):
    global failed
    global passed
    # 테스트케이스 변수 하나일 경우
    if len(tests[0]) == 1:
        uni = list(set([tuple(set(item)) for item in lineToTest[line]]))
        cases = uni
    # 그 외의 경우
    else:
        cases = lineToTest[line]

    # for, while 커버리지 중복 제거
    remove_dup = list(set(map(tuple, cases)))
    cases = remove_dup

    failed = 0
    passed = 0
    for l in cases:
        for m in range(len(tests)):
            if(l==tests[m]):
                if results[l]:
                    passed += 1
                else:
                    failed += 1

# tarantula
def scores_tarantula():
    suspiciousness = (failed / totalFailed) / ((passed / totalPassed) + (failed / totalFailed))
    return round(suspiciousness, 3)

# ochiai
def scores_ochiai():
    suspiciousness = (failed) / ((totalFailed*(failed + passed))**0.5)
    return round(suspiciousness, 3)

# barinel = SBI
# SBI : suspiciousness = 1 - float((passed)) / float((passed + failed))
def scores_barinel():
    suspiciousness = 1 - float((passed)) / float((passed + failed))
    return round(suspiciousness, 3)

# jaccard
def scores_jaccard():
    suspiciousness = (failed) / (totalFailed + passed)
    return round(suspiciousness, 3)

# AMPLE
def scores_AMPLE():
    suspiciousness = abs((failed / totalFailed)-(passed / totalPassed))
    return round(suspiciousness, 3)

#########################################################################


# 프로그램의 실행 추적
# 코드의 각 줄이 실행될 때 정보 출력
def traceit(frame, event, arg):
    if event == "line":
        lineno = frame.f_lineno
        filename = frame.f_globals["__file__"]
        testToLines[current].append(str(lineno))
        # lineToTest 각 라인을 실행하는 테스트케이스 저장
        if lineno in lineToTest.keys():
            lineToTest[lineno].append(current)
        else:
            lineToTest[lineno] = [current]
        name = frame.f_globals["__name__"]
        line = linecache.getline(filename, lineno)
        # linecache.getline - filename 파일에서 lineno 줄을 가져옴
        # rstip() 문자열의 지정된 문자열의 끝을 (기본값은 공백) 삭제
        # if filename == "tarantula.py": # 현재 파일 실행 추적
        #    print "%s:%s: %s" % (name, lineno, line.rstrip())
        '''
        else:   # 외부 파일 실행 추적
            print "%s:%s(%s)" % (name, lineno, str.join(', ', ("%s=%r" % item for item in frame.f_locals.iteritems())))
        '''
    return traceit


# 변수 lines 에 line 클래스 저장
def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            line = Line(0.0, 0, l, i + 1)   # Line 클래스 변수 할당, 테스트코드의 text 와 lineno
            line_tarantula = Line(0.0, 0, l, i + 1)
            line_ochiai = Line(0.0, 0, l, i + 1)
            line_barinel = Line(0.0, 0, l, i + 1)
            line_jaccard = Line(0.0, 0, l, i + 1)
            line_AMPLE = Line(0.0, 0, l, i + 1)
            line_sum = Line(0.0, 0, l, i + 1)
            testCode.append(l)
            lines.append(line)
            lines_tarantula.append(line_tarantula)
            lines_ochiai.append(line_ochiai)
            lines_barinel.append(line_barinel)
            lines_jaccard.append(line_jaccard)
            lines_AMPLE.append(line_AMPLE)
            lines_sum.append(line_sum)
    return i + 1


# 코드 라인에 의심도와 랭크 할당 #############################
def makeListOfAllLines_tarantula():
    for i in range(len(lines_tarantula)):
        try:
            lines_tarantula[list_num[i]-1].setScore(scoreList_tarantula[i])
            lines_tarantula[i].setRank(ranked_tarantula[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_ochiai():
    for i in range(len(lines_ochiai)):
        try:
            lines_ochiai[list_num[i]-1].setScore(scoreList_ochiai[i])
            lines_ochiai[i].setRank(ranked_ochiai[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_barinel():
    for i in range(len(lines_barinel)):
        try:
            lines_barinel[list_num[i]-1].setScore(scoreList_barinel[i])
            lines_barinel[i].setRank(ranked_barinel[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_jaccard():
    for i in range(len(lines_jaccard)):
        try:
            lines_jaccard[list_num[i]-1].setScore(scoreList_jaccard[i])
            lines_jaccard[i].setRank(ranked_jaccard[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_AMPLE():
    for i in range(len(lines_AMPLE)):
        try:
            lines_AMPLE[list_num[i]-1].setScore(scoreList_AMPLE[i])
            lines_AMPLE[i].setRank(ranked_AMPLE[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_sum():
    for i in range(len(lines_sum)):
        try:
            lines_sum[list_num[i]-1].setScore(scoreList_sum[i])
            lines_sum[i].setRank(ranked_sum[i + 1])
        except IndexError:
            continue

# console 에 결과 print #################################
def printToScreen_tarantula():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_tarantula[i].lineNo, '\t', lines_tarantula[i].score, '  ', '\t','\t', lines_tarantula[i].rank, '\t', lines_tarantula[i].text.rstrip())

def printToScreen_ochiai():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_ochiai[i].lineNo, '\t', lines_ochiai[i].score, '  ', '\t','\t', lines_ochiai[i].rank, '\t', lines_ochiai[i].text.rstrip())

def printToScreen_barinel():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_barinel[i].lineNo, '\t', lines_barinel[i].score, '  ', '\t','\t', lines_barinel[i].rank, '\t', lines_barinel[i].text.rstrip())

def printToScreen_jaccard():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_jaccard[i].lineNo, '\t', lines_jaccard[i].score, '  ', '\t','\t', lines_jaccard[i].rank, '\t', lines_jaccard[i].text.rstrip())

def printToScreen_AMPLE():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_AMPLE[i].lineNo, '\t', lines_AMPLE[i].score, '  ', '\t','\t', lines_AMPLE[i].rank, '\t', lines_AMPLE[i].text.rstrip())

def printToScreen_sum():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines_sum[i].lineNo, '\t', lines_sum[i].score, '  ', '\t','\t', lines_sum[i].rank, '\t', lines_sum[i].text.rstrip())

##############################################

# output.txt 에 결과 작성
def exportToFile():
    file = open(outputFile, "w")
    file.write('Line\tSuspiciousness\tRank\t')
    for i in range(len(tests)):
        file.write(str(tests[i]) + '\t')
    file.write('\n')

    # 현재 문제 왜 tarantula가 아니라 sum 으로 출력되는가
    file.write('tarantula\n')
    text_tarantula = []
    for i in range(0, numLines):
        text_tarantula.append(str(lines_tarantula[i].lineNo) + ' \t\t' + str(lines_tarantula[i].score) + ' ' + '\t\t\t' + str(
            lines_tarantula[i].rank) + '\t\t' + str(lines_tarantula[i].text.rstrip()) + '\n')
    text_tarantula.sort(key=lambda x: (int(re.search(r"\d+", x).group())))

    for i in range(0, numLines):
        try:
            file.write(text_tarantula[i])
        except IndexError:
            continue

    file.write('\nsum\n')
    text_sum = []
    for i in range(0, numLines):
        text_sum.append(str(lines_sum[i].lineNo) + ' \t\t' + str(lines_sum[i].score) + ' ' + '\t\t\t' + str(lines_sum[i].rank) + '\t\t' + str(lines_sum[i].text.rstrip()) + '\n')
    text_sum.sort(key=lambda x: (int(re.search(r"\d+", x).group())))

    for i in range(0, numLines):
        try:
            file.write(text_sum[i])
        except IndexError:
            continue

    file.write('\t\t\t\t\t\t\t\t ')
    for i in range(len(tests)):
        file.write(str(results[tests[i]]) + '\t\t  ')
    file.close()
    print("\nDetailed report exported to output.txt")


### Globals - appearing as the very incarnation of devil himself
testFileName = sys.argv[1]  # mid.py
resultsFileName = sys.argv[2]   # testCasesMid
funName = os.path.splitext(testFileName)[0] # mid
outputFile = 'output.txt'
testToLines = {}    # 각 테스트케이스에서 지나는 커버리지 저장
lineToTest = {}     # 각 라인을 실행하는 테스트케이스 저장
results = {}
current = []
tests = []
totalPassed = 0.0
totalFailed = 0.0
lines = []
lines_tarantula = []
lines_ochiai = []
lines_barinel = []
lines_jaccard = []
lines_AMPLE = []
lines_sum = []
testCode = []
testCaseResuts = []
exp = []
res = []
dup_cov = []
dup_num = []

# importFileNames()
exec(open(testFileName).read())
importResultsFile()
numLines = file_len(testFileName)   # 테스트할 파일 라인 수


# Algorithm starts from here
for i in range(len(tests)):
    current = tests[i]  # 각 테스트케이스 값 저장 ex) (3, 3, 5)
    testToLines[tests[i]] = []  # 각 테스트케이스에서 지나는 커버리지값 저장
    # 추적함수
    sys.settrace(traceit)

    # tests[]는 테스트케이스
    # funName = os.path.splitext(testFileName)[0] -> mid
    # funName*(tests[i])) -> mid.py 를 테스트 케이스로 실행
    exec('%s(*(tests[i]))' % funName)

    # 테스트케이스가 지나는 커버리지 확인하기 위해 추가
    # for, while 커버리지 중복 제거 #############
    unique = list(set(testToLines[tests[i]]))
    unique = list(map(int, unique))
    unique.sort()
    testToLines[tests[i]] = unique
    ############################################
    if i == len(tests)-1:
        for j in range(len(tests)):
            print(j, ' Expected :', exp[j], ', Result :', res[j], ", TestCase :", str(tests[j]), ",", str(results[tests[j]]), ", Coverage :", str(testToLines[tests[j]]))

    # 중복된 커버리지 같는 테스트케이스 추출 ##########################################
    if i == len(tests)-1:
        for j in range(len(tests)):
            count = 0
            for k in range(len(tests)):
                if(testToLines[tests[j]] == testToLines[tests[k]] and results[tests[j]] == results[tests[k]]):
                    count = count + 1
                    if(count != 1):
                        dup_cov.append(tests[k])

    unique = list(set(dup_cov))
    unique.sort()
    dup_cov = unique

    ##################################################################################

    # totalpassed, totalfailed 줄이고 results, tests 중복 없애고 passfail 함수에서도 cases 중복되는 temp 제거 해야함
    if i == len(tests) - 1:
        count = 0
        for j in range(len(tests)):
            for k in range(len(dup_cov)):
                if(tests[j] == dup_cov[k]):
                    dup_num.append(j)
                    if(results[tests[j]] == True):
                        totalPassed = totalPassed - 1
                    if(results[tests[j]] == False):
                        totalFailed = totalFailed - 1
        for j in range(len(dup_num)):
            del tests[dup_num[j]-count]
            del exp[dup_num[j]-count]
            del res[dup_num[j]-count]
            count = count + 1

print('\n중복된 커버리지 통합 후')
for j in range(len(tests)):
    print(j, ' Expected :', exp[j], ', Result :', res[j], ", TestCase :", str(tests[j]), ",", str(results[tests[j]]), ", Coverage :", str(testToLines[tests[j]]))


for i in range(1, numLines):
    if i not in lineToTest.keys():
        lineToTest[i] = []


# Calculate Suscpiciousness
suspiciousness_tarantula = {}
scoreList_tarantula = []
suspiciousness_ochiai = {}
scoreList_ochiai = []
suspiciousness_barinel = {}
scoreList_barinel = []
suspiciousness_jaccard = {}
scoreList_jaccard = []
suspiciousness_AMPLE = {}
scoreList_AMPLE = []
suspiciousness_sum = {}
scoreList_sum = []
list_num = []

for k in list(lineToTest):
    list_num.append(k)
    passfail(k)
    # tarantula
    try:
        score = scores_tarantula()   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_tarantula.append(score)
    except:
        score = 0.0
        scoreList_tarantula.append(score)
    finally:
        if score in suspiciousness_tarantula.keys():
            suspiciousness_tarantula[score].append(k)
        else:
            suspiciousness_tarantula[score] = [k]

    # ochiai
    try:
        score = scores_ochiai()   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_ochiai.append(score)
    except:
        score = 0.0
        scoreList_ochiai.append(score)
    finally:
        if score in suspiciousness_ochiai.keys():
            suspiciousness_ochiai[score].append(k)
        else:
            suspiciousness_ochiai[score] = [k]

    # barinel
    try:
        score = scores_barinel()   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_barinel.append(score)
    except:
        score = 0.0
        scoreList_barinel.append(score)
    finally:
        if score in suspiciousness_barinel.keys():
            suspiciousness_barinel[score].append(k)
        else:
            suspiciousness_barinel[score] = [k]

    # jaccard
    try:
        score = scores_jaccard()   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_jaccard.append(score)
    except:
        score = 0.0
        scoreList_jaccard.append(score)
    finally:
        if score in suspiciousness_jaccard.keys():
            suspiciousness_jaccard[score].append(k)
        else:
            suspiciousness_jaccard[score] = [k]

    # AMPLE
    try:
        score = scores_AMPLE()   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_AMPLE.append(score)
    except:
        score = 0.0
        scoreList_AMPLE.append(score)
    finally:
        if score in suspiciousness_AMPLE.keys():
            suspiciousness_AMPLE[score].append(k)
        else:
            suspiciousness_AMPLE[score] = [k]

    # sum
    try:
        score = (scores_tarantula() + scores_ochiai() + scores_barinel() + scores_jaccard() + scores_AMPLE()) / 5
        score = round(score, 3)
        scoreList_sum.append(score)
    except:
        score = 0.0
        scoreList_sum.append(score)
    finally:
        if score in suspiciousness_sum.keys():
            suspiciousness_sum[score].append(k)
        else:
            suspiciousness_sum[score] = [k]


ranked_tarantula = rank(suspiciousness_tarantula)
makeListOfAllLines_tarantula()
lines_tarantula.sort()
print('\ntarantula')
printToScreen_tarantula()

ranked_ochiai = rank(suspiciousness_ochiai)
makeListOfAllLines_ochiai()
lines_ochiai.sort()
print('\nochiai')
printToScreen_ochiai()

ranked_barinel = rank(suspiciousness_barinel)
makeListOfAllLines_barinel()
lines_barinel.sort()
print ('\nbarinel')
printToScreen_barinel()

ranked_jaccard = rank(suspiciousness_jaccard)
makeListOfAllLines_jaccard()
lines_jaccard.sort()
print ('\njaccard')
printToScreen_jaccard()

ranked_AMPLE = rank(suspiciousness_AMPLE)
makeListOfAllLines_AMPLE()
lines_AMPLE.sort()
print ('\nAMPLE')
printToScreen_AMPLE()

ranked_sum = rank(suspiciousness_sum)
makeListOfAllLines_sum()
lines_sum.sort()
print('\nsum')
printToScreen_sum()

exportToFile()