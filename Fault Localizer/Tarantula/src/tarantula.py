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

            line2 = file.readline()
            # print line2
            # line2 는 각 테스트케이스 P/F or 예상결과

            expected = line2.strip('\n')
            print 'Expected :', expected, ', Result :', test_output

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
# tarantula
def scores_tarantula(line):
    if len(tests[0]) == 1:
        uni = list(set([tuple(set(item)) for item in lineToTest[line]]))
        cases = uni
    else:
        cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = (failed / totalFailed) / ((passed / totalPassed) + (failed / totalFailed))
    return round(suspiciousness, 3)

# ochiai
def scores_ochiai(line):
    if len(tests[0]) == 1:
        uni = list(set([tuple(set(item)) for item in lineToTest[line]]))
        cases = uni
    else:
        cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = (failed) / ((totalFailed*(failed + passed))**0.5)
    return round(suspiciousness, 3)

# op2
def scores_op2(line):
    if len(tests[0]) == 1:
        uni = list(set([tuple(set(item)) for item in lineToTest[line]]))
        cases = uni
    else:
        cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = failed - (passed) / (totalPassed + 1)
    if suspiciousness < 0:
        suspiciousness = 0
    return round(suspiciousness, 3)

# barinel
def scores_barinel(line):
    if len(tests[0]) == 1:
        uni = list(set([tuple(set(item)) for item in lineToTest[line]]))
        cases = uni
    else:
        cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = 1 - float((passed)) / float((passed + failed))
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
            line = Line(0.0, 0, l, i + 1)   # Line 클래스 변수 할당, mid.py 의 text 와 lineno
            testCode.append(l)
            lines.append(line)
            lines_tarantula.append(line)
            lines_ochiai.append(line)
            lines_op2.append(line)
            lines_barinel.append(line)
            lines_sum.append(line)
    return i + 1


# 코드 라인에 의심도와 랭크 할당 #############################
def makeListOfAllLines_tarantula():
    for i in range(len(lines_tarantula)):
        try:
            lines_tarantula[i].setScore(scoreList_tarantula[i])
            lines_tarantula[i].setRank(ranked_tarantula[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_ochiai():
    for i in range(len(lines_ochiai)):
        try:
            lines_ochiai[i].setScore(scoreList_ochiai[i])
            lines_ochiai[i].setRank(ranked_ochiai[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_op2():
    for i in range(len(lines_op2)):
        try:
            lines_op2[i].setScore(scoreList_op2[i])
            lines_op2[i].setRank(ranked_op2[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_barinel():
    for i in range(len(lines_barinel)):
        try:
            lines_barinel[i].setScore(scoreList_barinel[i])
            lines_barinel[i].setRank(ranked_barinel[i + 1])
        except IndexError:
            continue

def makeListOfAllLines_sum():
    for i in range(len(lines_sum)):
        try:
            lines_sum[i].setScore(scoreList_sum[i])
            lines_sum[i].setRank(ranked_sum[i + 1])
        except IndexError:
            continue
##############################################################

def removeKachra():
    toDelete = []
    for j in lines:
        if j.rank == 0:
            toDelete.append(j)
    for obj in toDelete:
        lines.remove(obj)


# console 에 결과 print #################################
def printToScreen_tarantula():
    print "Top 10 most suspicious lines"
    print 'Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code'  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print lines_tarantula[i].lineNo, '\t', lines_tarantula[i].score, '\t', '\t', lines_tarantula[i].rank, '\t', lines_tarantula[i].text.rstrip()

def printToScreen_ochiai():
    print "Top 10 most suspicious lines"
    print 'Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code'  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print lines_ochiai[i].lineNo, '\t', lines_ochiai[i].score, '\t', '\t', lines_ochiai[i].rank, '\t', lines_ochiai[i].text.rstrip()

def printToScreen_op2():
    print "Top 10 most suspicious lines"
    print 'Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code'  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print lines_op2[i].lineNo, '\t', lines_op2[i].score, '\t', '\t', lines_op2[i].rank, '\t', lines_op2[i].text.rstrip()

def printToScreen_barinel():
    print "Top 10 most suspicious lines"
    print 'Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code'  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print lines_barinel[i].lineNo, '\t', lines_barinel[i].score, '\t', '\t', lines_barinel[i].rank, '\t', lines_barinel[i].text.rstrip()

def printToScreen_sum():
    print "Top 10 most suspicious lines"
    print 'Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code'  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print lines_sum[i].lineNo, '\t', lines_sum[i].score, '\t', '\t', lines_sum[i].rank, '\t', lines_sum[i].text.rstrip()

##############################################

# output.txt 에 결과 작성
def exportToFile():
    file = open(outputFile, "w")
    file.write(
        'Line\tSuspiciousness\tRank\t' + str(tests[0]) + '\t' + str(tests[1]) + '\t' + str(tests[2]) + '\t' + str(
            tests[3]) + '\t' + str(tests[4]) + '\t' + str(tests[5]) + '\n')

    text = []
    for i in range(0, numLines):
        text.append(str(lines[i].lineNo) + ' \t\t' + str(lines[i].score) + '  \t\t\t' + str(lines[i].rank) + '\t\t' + str(lines[i].text.rstrip()) + '\n')
    text.sort(key=lambda x: (int(re.search(r"\d+", x).group())))

    for i in range(0, numLines):
        try:
            file.write(text[i])
        except IndexError:
            continue

    file.write('\t\t\t\t\t\t\t\t' + str(results[tests[0]]) + '\t\t' + str(results[tests[1]]) + '\t\t' +
               str(results[tests[2]]) + '\t\t' + str(results[tests[3]]) + '\t\t' + str(results[tests[4]]) + '\t\t' +
               str(results[tests[5]]))
    file.close()
    print ("Detailed report exported to output.txt")


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
lines_op2 = []
lines_barinel = []
lines_sum = []
testCode = []
testCaseResuts = []


# importFileNames()
execfile(testFileName)
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
    exec ('%s(*(tests[i]))' % funName)

    # 테스트케이스가 지나는 커버리지 확인하기 위해 추가함
    unique = list(set(testToLines[tests[i]]))
    unique = sorted(unique)
    testToLines[tests[i]] = unique
    if i == len(tests)-1:
        for j in range(len(tests)):
            print str(tests[j]), ",", str(results[tests[j]]), ":", str(testToLines[tests[j]])

for i in range(1, numLines):
    if i not in lineToTest.keys():
        lineToTest[i] = []


# Calculate Suscpiciousness
suspiciousness_tarantula = {}
scoreList_tarantula = []
suspiciousness_ochiai = {}
scoreList_ochiai = []
suspiciousness_op2 = {}
scoreList_op2 = []
suspiciousness_barinel = {}
scoreList_barinel = []
suspiciousness_sum = {}
scoreList_sum = []

for k in lineToTest.keys():
    # tarantula
    try:
        score = scores_tarantula(k)   # 의심도 계산 알고리즘 적용하는 곳
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
        score = scores_ochiai(k)   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_ochiai.append(score)
    except:
        score = 0.0
        scoreList_ochiai.append(score)
    finally:
        if score in suspiciousness_ochiai.keys():
            suspiciousness_ochiai[score].append(k)
        else:
            suspiciousness_ochiai[score] = [k]

    # op2
    try:
        score = scores_op2(k)   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_op2.append(score)
    except:
        score = 0.0
        scoreList_op2.append(score)
    finally:
        if score in suspiciousness_op2.keys():
            suspiciousness_op2[score].append(k)
        else:
            suspiciousness_op2[score] = [k]

    # barinel
    try:
        score = scores_barinel(k)   # 의심도 계산 알고리즘 적용하는 곳
        scoreList_barinel.append(score)
    except:
        score = 0.0
        scoreList_barinel.append(score)
    finally:
        if score in suspiciousness_barinel.keys():
            suspiciousness_barinel[score].append(k)
        else:
            suspiciousness_barinel[score] = [k]

    # sum
    try:
        score = (scores_tarantula(k) + scores_ochiai(k) + scores_op2(k) + scores_barinel(k)) / 4
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
removeKachra()
lines_tarantula.sort()
print '\ntarantula'
printToScreen_tarantula()

ranked_ochiai = rank(suspiciousness_ochiai)
makeListOfAllLines_ochiai()
removeKachra()
lines_ochiai.sort()
print '\nochiai'
printToScreen_ochiai()

ranked_op2 = rank(suspiciousness_op2)
makeListOfAllLines_op2()
removeKachra()
lines_op2.sort()
print '\nop2'
printToScreen_op2()

ranked_barinel = rank(suspiciousness_barinel)
makeListOfAllLines_barinel()
removeKachra()
lines_barinel.sort()
print '\nbarinel'
printToScreen_barinel()

ranked_sum = rank(suspiciousness_sum)
makeListOfAllLines_sum()
removeKachra()
lines_sum.sort()
print '\nsum'
printToScreen_sum()

exportToFile()
