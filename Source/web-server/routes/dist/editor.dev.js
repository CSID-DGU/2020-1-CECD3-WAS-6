"use strict";

var express = require('express');

var router = express.Router();
router.post('/compile', function (req, res, next) {
  try {
    var _req$body = req.body,
        code = _req$body.code,
        testCase = _req$body.testCase;
    console.log(req.body);
    var codeConvert = "def mid(x,y,z):\n        m = z\n        if (y<z):       0.9 \n            if(x<y):    0.5 \n                m = y   0.2\n            elif (x<z): 0.6\n                m = y\n        else:\n            if(x>y):    0.5\n                m = y\n            elif (x>z):\n                m = x\n        return m\n    ";
    res.status(200).send({
      result: true,
      data: codeConvert,
      message: '컴파일 성공'
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;