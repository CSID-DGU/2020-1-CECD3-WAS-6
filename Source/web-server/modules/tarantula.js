const {spawn, exec} = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path')
const zipFolder = require('zip-a-folder');
const { connect } = require('../routes/editor');
const { Console } = require('console');

const ROOT = process.env.ROOT;

function compileTarantula(filename){
    try {
        console.log(filename)
        let python = spawn("python", ['tarantula.py' , filename, 'testcase'], {cwd: ROOT });
        return python;
    } catch (error) {
        console.log(error)        
    }
}

function compileScale(code) {
    try {
        return new Promise(function(res, rej){
            let scalaPrint = "";
            const ls = exec(`"C:\\Program Files\\Java\\jdk1.8.0_251\\bin\\java.exe" "-javaagent:C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2019.1.3\\lib\\idea_rt.jar=53358:C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2019.1.3\\bin" -Dfile.encoding=UTF-8 -classpath "C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\charsets.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\deploy.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\access-bridge-64.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\cldrdata.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\dnsns.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\jaccess.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\jfxrt.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\localedata.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\nashorn.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunec.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunjce_provider.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunmscapi.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\sunpkcs11.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\ext\\zipfs.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\javaws.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jce.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jfr.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jfxswt.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\jsse.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\management-agent.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\plugin.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\resources.jar;C:\\Program Files\\Java\\jdk1.8.0_251\\jre\\lib\\rt.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\target\\\\scala-2.11\\\\classes;C:\\\\Users\\\\nguye\\\\AppData\\\\Local\\\\Coursier\\\\cache\\\\v1\\\\https\\\\repo1.maven.org\\\\maven2\\\\org\\\\scala-lang\\\\scala-library\\\\2.11.12\\\\scala-library-2.11.12.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\scala-parser-combinators-2.11.0-M4.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\unmanaged\\\\com.microsoft.z3.jar;D:\\\\Desktop\\\\Capstone\\\\Code\\\\2020-1-CECD3-WAS-6\\\\untitled\\\\unmanaged\\\\scalaz3_2.13-4.7.1.jar" -jar untitled.jar ${code}`, function (error, stdout, stderr) {
            if (error) {
                    console.log(error.stack);
                    console.log('Error code: ' + error.code);
                    console.log('Signal received: ' + error.signal);
                }
                // console.log(stdout)
                // console.log(stderr)
                scalaPrint = stdout
                res(scalaPrint);
            });
            ls.on('exit', function (code) {}); 
        })
    }
    catch (error) {
        console.log(error)        
    }
}
function replaceStringFromTo(string, replaceString ,from, to){
    let subFirstString = string.substr(0, from)
    let secondString = string.substr(to, string.length)
    return subFirstString + replaceString + secondString
}
function modifyLine(selectLine, pathOutputFile)
{
    return new Promise(function(res, rej){
        let rl = readline.createInterface({
            input: fs.createReadStream(pathOutputFile)
        });
    
        let lineNumber = 0;
        let code = "";

        rl.on('line', function(line, linecount) {
            lineNumber++;
            
            if(lineNumber === Number(selectLine))
            {
                //!수정
                // while문
                let result = "";
                //while()
                //while
                if(line.includes("while")){
                    let indexStart = line.indexOf("while") + 6
                    let indexEnd = line.indexOf(":") - 1
                    result = replaceStringFromTo(line, "!!", indexStart, indexEnd)

                }   
                else if(line.includes("if")){
                    let indexStart = line.indexOf("(") + 1
                    let indexEnd = line.indexOf(")")

                    console.log(indexStart, indexEnd)
                    result = replaceStringFromTo(line, "!!", indexStart, indexEnd)
                    indexEnd = line.indexOf(":")
                }
                else{
                    // result = replaceStringFromTo(line, "??", line.indexOf('int') ,line.length)
                    var i = 0;
                    while(true){  
                        var res = line.charAt(i++)
                        if(res !== ' ')
                            break;
                    }
                    result = replaceStringFromTo(line, '??', i - 1, line.length);
                }
                line = result;
            }
            if(line.indexOf("#") !== -1)
            {
                line = replaceStringFromTo(line, "", line.indexOf("#"), line.length)
            }
            code = code + line + "\n";
        });
        rl.on('close', function(line) {
            //! 수정필요함
            console.log(code)
            var indexOfNewLine = getIndicesOf("\n", code)
                        
            let convertFormCode = ""        
            var codeString = JSON.stringify(code)
    
            if(code.charAt(code.length) !== " "){
                convertFormCode = code.substr(0, indexOfNewLine[indexOfNewLine.length - 1])
            }else{
                if(code.charCodeAt(code.charAt(indexOfNewLine[indexOfNewLine.length - 1] - 1))){
                    convertFormCode = code.substr(0, indexOfNewLine[indexOfNewLine.length - 1] - 2)
                }else{
                    convertFormCode = code.substr(0, indexOfNewLine[indexOfNewLine.length - 1] - 1)
                }
            }
            res(convertFormCode);
        });
    })
}
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
module.exports = { compileTarantula, modifyLine, compileScale }