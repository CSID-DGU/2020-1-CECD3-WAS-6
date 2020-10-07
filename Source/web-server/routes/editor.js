var express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path');
const tarantula = require('../modules/tarantula.js');


const ROOT = process.env.ROOT;
router.post('/compile', function(req, res, next){
    try {
        const { code, testCase } = req.body;
        
        const pathSource = path.resolve(ROOT, 'gcd.py');
        const pathTestCase = path.resolve(ROOT, 'testcase');
        const pathOutput = path.resolve(ROOT, 'output.txt');

        fs.writeFileSync(pathSource, code ,function(err) {
            if(err) return console.error('Source write error' + err);
        })

        fs.writeFileSync(pathTestCase, JSON.parse(testCase) ,function(err) {
            if(err) return console.error('Test Case write error' + err);
        })
        
        const python = tarantula.compileTarantula();
        

        python.on('close', (code) => {
            // console.log(`child process close all stdio with code ${code}`);
            const outputCode = fs.readFileSync(pathOutput, {encoding: 'utf-8', flag: 'r'})
                res.status(200).send({
                result: true,
                data: outputCode,
                message: '컴파일 성공'
            })
        });
        
    } catch (error) {
        console.log(error)
    }
})
router.get('/modify', async function(req, res, next){
    const { selectLine } = req.query;
    
    const pathOutput = path.resolve(ROOT, 'output.txt');
    const modifyCode = await tarantula.modifyLine(selectLine, pathOutput);

    res.status(200).send({
        result: true,
        data: modifyCode,
        message: '컴파일 성공'
    })
})  
module.exports = router