const {spawn} = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path')

const ROOT = process.env.ROOT;

function compileTarantula(){
    try {
        let python = spawn("python", ['tarantula.py' , 'gcd.py', 'testcase'], {cwd: ROOT });
        return python;
    } catch (error) {
        console.log(error)        
    }
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
                line = line + " select line";
            }
            console.log(linecount)
            code = code + line + "\n";
        });
    
        rl.on('close', function(line) {
            res(code);
        });
    })
}
module.exports = { compileTarantula, modifyLine }