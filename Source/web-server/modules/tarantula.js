const {spawn} = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path')

const ROOT = process.env.ROOT;

function compileTarantula(pathCourse, pathTestCase){
    console.log(pathCourse)
    console.log(pathTestCase)
    let python = spawn("python", ['tarantula.py' , 'mid.py', 'testCaseMid2'], {cwd: ROOT });
    return python;
}
function modifyLine(selectLine, pathOutputFile)
{
    return new Promise(function(res, rej){

        let rl = readline.createInterface({
            input: fs.createReadStream(pathOutputFile)
        });
    
        let lineNumber = 0;
        let code = "";

        rl.on('line', function(line) {
            lineNumber++;
            if(lineNumber === Number(selectLine))
            {
                line = line + "select line";
            }
            code = code + line + "\n";
        });
    
        rl.on('close', function(line) {
            res(code);
        });
    })
}
module.exports = { compileTarantula, modifyLine }