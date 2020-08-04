var express = require('express')
const router = express.Router();

router.post('/compile', function(req, res, next){
    try {
        const { code, testCase } = req.body;
        console.log(req.body)

        res.status(200).send({
            result: true,
            data: code,
            message: '컴파일 성공'
        })
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router