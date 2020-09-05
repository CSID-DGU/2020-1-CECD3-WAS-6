var express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path');
const tarantula = require('../modules/tarantula.js');


const ROOT = process.env.ROOT;
router.post('/compile', function(req, res, next){
    try {
        const { code, testCase } = req.body;
        
        const pathSource = path.resolve(ROOT, 'mid.py');
        const pathTestCase = path.resolve(ROOT, 'testCaseMid2');
        const pathOutput = path.resolve(ROOT, 'output.txt');

        fs.writeFileSync(pathSource, code ,function(err) {
            if(err) return console.error('Source write error' + err);
        })

        fs.writeFileSync(pathTestCase, JSON.parse(testCase) ,function(err) {
            if(err) return console.error('Test Case write error' + err);
        })
        
        const python = tarantula.compileTarantula(pathSource, pathTestCase);
        
        // let codeToSend;
        // function emitter(data) {
        //     codeToSend = data;
        // }
        // python.stdout.on("data", emitter);
        // python.stderr.on("data", emitter);

        python.on('close', (code) => {
            // console.log(`child process close all stdio with code ${code}`);
            const outputCode = fs.readFileSync(pathOutput, {encoding: 'utf-8', flag: 'r'})
            res.status(200).send({
            result: true,
            data: outputCode,
            message: '컴파일 성공'
            })
        });
        // console.on("close", emitFinish(socket));

    //     const codeConvert = `def mid(x,y,z):
    //     m = z
    //     if (y<z):       0.9 
    //         if(x<y):    0.5 
    //             m = y   0.2
    //         elif (x<z): 0.6
    //             m = y
    //     else:
    //         if(x>y):    0.5
    //             m = y
    //         elif (x>z):
    //             m = x
    //     return m
    // `;
    //     res.status(200).send({
    //         result: true,
    //         data: codeConvert,
    //         message: '컴파일 성공'
    //     })
        
    } catch (error) {
        console.log(error)
    }
})
router.get('/modify', async function(req, res, next){
    const { selectLine } = req.query;
    console.log(req)
    console.log(selectLine);    
    
    const pathOutput = path.resolve(ROOT, 'output.txt');
    const modifyCode = await tarantula.modifyLine(selectLine, pathOutput);

    console.log(modifyCode)
    res.status(200).send({
        result: true,
        data: modifyCode,
        message: '컴파일 성공'
    })
})  
module.exports = router