const {spawn} = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path')
const zipFolder = require('zip-a-folder');

const ROOT = process.env.ROOT;

function compileTarantula(){
    try {
        let python = spawn("python", ['tarantula.py' , 'gcd.py', 'testcase'], {cwd: ROOT });
        return python;
    } catch (error) {
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
                console.log(line.includes("while"))
                //while()
                //while
                if(line.includes("while")){
                    let indexStart = line.indexOf("while") + 6
                    let indexEnd = line.indexOf(":") - 1
                    result = replaceStringFromTo(line, "??", indexStart, indexEnd)

                }   
                else if(line.includes("if")){
                    let indexStart = line.indexOf("if") + 3
                    let indexEnd = line.indexOf(":") - 1
                    result = replaceStringFromTo(line, "??", indexStart, indexEnd)
                    indexEnd = line.indexOf(":")
                }
                line = result;
            }
            code = code + line + "\n";
        });
    
        rl.on('close', function(line) {
            res(code);
        });
    })
}
module.exports = { compileTarantula, modifyLine }