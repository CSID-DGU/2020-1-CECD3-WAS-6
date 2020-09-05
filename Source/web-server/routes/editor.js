var express = require('express')
const router = express.Router();

router.post('/compile', function(req, res, next){
    try {
        const { code, testCase } = req.body;
        console.log(req.body)
        const codeConvert = `def mid(x,y,z):
        m = z
        if (y<z):       0.9 
            if(x<y):    0.5 
                m = y   0.2
            elif (x<z): 0.6
                m = y
        else:
            if(x>y):    0.5
                m = y
            elif (x>z):
                m = x
        return m
    `;
        res.status(200).send({
            result: true,
            data: codeConvert,
            message: '컴파일 성공'
        })
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router