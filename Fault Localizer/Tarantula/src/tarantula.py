# -*- coding: utf-8 -*-
import sys
import collections
import csv
import fileinput
import linecache
import os
from optparse import OptionParser


#Line클래스
#score
#rank
#text
#lineNo
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


def importFileNames():
    global testFileName
    global resultsFileName
    global funName
    f = open('importNames.csv', 'rb')
    reader = csv.reader(f)
    for row in reader:
        testFileName = row[0]
        resultsFileName = row[1]
    f.close()
    funName = os.path.splitext(testFileName)[0]
    outputFile = 'output.txt'


#결과 파일 import하는것
#문제 : P,F를 사용자가 직접 알려줘야 함
#testCaseResults에 (testcase, P / F) 형태의 list로 저장
def importResultsFile():
    import os
    import importlib

    ##################tarantula.py 파일 있는 경로 맞춰줘야함#####
    os.chdir('C:\\Users\\wnddk\\OneDrive\\바탕 화면\\tarantula')

    module_name = testFileName.split('.')[0]
    print(module_name)
    module = importlib.import_module(module_name)
    my_method = getattr(module, module_name)

    global totalPassed
    global totalFailed
    with open(resultsFileName, 'r') as file:
        while True:
            line = file.readline()
            #print (line)
            try:
                numbers = tuple([int(num) for num in line.split(',')])
                tests.append(numbers)

            except ValueError:
                break

            ########################################이부분을 고쳐야 함###############
            test_output = my_method(*numbers)



            line2 = file.readline()
            # print line2
            #if line2 == 'F\n' or line2 == 'F':
            if int(line2) != test_output:
                totalFailed += 1
                results[numbers] = False
            #if line2 == 'P\n' or line2 == 'P':
            if int(line2) == test_output:
                totalPassed += 1
                results[numbers] = True
            testCaseResuts.append((line.rstrip(), line2.rstrip()))
            #######################################################################


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
#tarantula
def scores(line):
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

####ochiai score
def scores_ochiai(line):
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


def scores_op2(line):
    cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = failed - (passed) / (totalPassed + 1)
    return round(suspiciousness, 3)

def scores_barinel(line):
    cases = lineToTest[line]
    failed = 0
    passed = 0
    for l in cases:
        if results[l]:
            passed += 1
        else:
            failed += 1
    suspiciousness = 1 - passed/(passed + failed)
    return round(suspiciousness, 3)


#########################################################################


def traceit(frame, event, arg):
    if event == "line":
        lineno = frame.f_lineno
        filename = frame.f_globals["__file__"]
        testToLines[current].append(str(lineno))
        if lineno in list(lineToTest.keys()):
            lineToTest[lineno].append(current)
        else:
            lineToTest[lineno] = [current]
        #print "%s:%s: %s" % (filename, lineno, linecache.getline(filename, lineno).rstrip())
    return traceit


def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            line = Line(0.0, 0, l, i + 1)
            testCode.append(l)
            lines.append(line)
    return i + 1


def makeListOfAllLines():
    for i in range(len(lines)):
        try:
            lines[i].setScore(scoreList[i])
            lines[i].setRank(ranked[i + 1])
        except IndexError:
            continue


def removeKachra():
    toDelete = []
    for j in lines:
        if j.rank == 0:
            toDelete.append(j)

    for obj in toDelete:
        lines.remove(obj)


def printToScreen():
    print("Top 10 most suspicious lines")
    print('Line', '\t', 'Suspiciousness', '\t', 'Rank', '\t', 'Line of Code')  # , '\t', tests[0], '\t', tests[1], '\t', tests[2], '\t', tests[3], '\t', tests[4], '\t', tests[5]
    for i in range(min(10, numLines)):
        print(lines[i].lineNo, '\t', lines[i].score, '\t', '\t', lines[i].rank, '\t', lines[i].text.rstrip())


def exportToFile():
    file = open(outputFile, "w")
    file.write(
        'Line\tSuspiciousness\tRank\t' + str(tests[0]) + '\t' + str(tests[1]) + '\t' + str(tests[2]) + '\t' + str(
            tests[3]) + '\t' + str(tests[4]) + '\t' + str(tests[5]) + '\n')
    for i in range(0, numLines):
        try:
            file.write(str(i + 1) + '\t' + str(scoreList[i]) + '\t' + '\t' + str(ranked[i + 1]) + '\t' + str(
                lines[i].text.rstrip()) + '\n')
        except IndexError:
            continue
    file.write('\t\t\t\t' + str(results[tests[0]]) + '\t\t' + str(results[tests[1]]) + '\t\t' + str(
        results[tests[2]]) + '\t\t' + str(results[tests[3]]) + '\t\t' + str(results[tests[4]]) + '\t\t' + str(
        results[tests[5]]))
    file.close()
    print ("Detailed report exported to output.txt")


### Globals - appearing as the very incarnation of devil himself
testFileName = sys.argv[1]
resultsFileName = sys.argv[2]
funName = os.path.splitext(testFileName)[0]
outputFile = 'output.txt'
testToLines = {}
lineToTest = {}
results = {}
current = []
tests = []
totalPassed = 0.0
totalFailed = 0.0
lines = []
testCode = []
testCaseResuts = []

#print(testFileName)
#print(resultsFileName)

# importFileNames()
exec(compile(open(testFileName, "rb").read(), testFileName, 'exec'))
importResultsFile()
numLines = file_len(testFileName)



# Algorithm starts from here
for i in range(len(tests)):
    # current : 현재 넣을 매개변수 리스트
    current = tests[i]
    testToLines[tests[i]] = []

    sys.settrace(traceit)
    """
    def traceit(frame, event, arg):
        if event == "line":
            lineno = frame.f_lineno
            filename = frame.f_globals["__file__"]
            testToLines[current].append(str(lineno))
            if lineno in lineToTest.keys():
                lineToTest[lineno].append(current)
            else:
                lineToTest[lineno] = [current]
            # print "%s:%s: %s" % (filename, lineno, linecache.getline(filename, lineno).rstrip())  <- IOError 남
        return traceit
    """

    # tests[]는 테스트케이스
    # funName = os.path.splitext(testFileName)[0]
    # funName = mid
    # funName*(tests[i]))
    # mid.py 를 테스트 케이스로 실행??
    exec ('%s(*(tests[i]))' % funName)

for i in range(1, numLines):
    if i not in list(lineToTest.keys()):
        lineToTest[i] = []

# Calculate Suscpiciousness
suspiciousness = {}
scoreList = []
for k in list(lineToTest.keys()):
    try:
        score = scores(k)
        scoreList.append(score)
    except:
        score = 0.0
        scoreList.append(score)
    finally:
        if score in list(suspiciousness.keys()):
            suspiciousness[score].append(k)
        else:
            suspiciousness[score] = [k]




ranked = rank(suspiciousness)
makeListOfAllLines()
removeKachra()
lines.sort()
printToScreen()
exportToFile()
