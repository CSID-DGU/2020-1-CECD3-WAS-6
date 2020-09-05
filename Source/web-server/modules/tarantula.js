const {spawn} = require('child_process');
const path = require('path')

const ROOT = process.env.ROOT;

function compileTarantula(pathCourse, pathTestCase){
    console.log(pathCourse)
    console.log(pathTestCase)
    const pathTaranla = path.resolve(ROOT, 'tarantula.py')
    let python = spawn("python", ['tarantula.py' , 'mid.py', 'testCaseMid2'], {cwd: ROOT });
    return python;
}

module.exports = { compileTarantula }