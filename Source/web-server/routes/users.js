var express = require('express');
const db = require('../modules/db-connection');
const jwt = require('jsonwebtoken')
const sql = require('../sql')
var crypto = require('crypto');
const { authorizationAPI } = require('../modules/check-middleware')

var router = express.Router();


router.get('/auth', authorizationAPI, (req, res) => {
  res.status(200).send({
    result: true,
    data: req.user._user[0],
    message: '사용자 정보',
    isAuth: true
  })
})

/* GET users listing. */
router.post('/register', async function(req, res, next) {
  const { email, name, password } = req.body;
  try {
    if(email && name && password)
    {
      var encryptedPassword = crypto.createHash('sha256').update(String(password)).digest('base64');
      const [row] = await db.query(sql.user.getUserByEmail, [email]);
      if(row.length === 0)
      {
        await db.query(sql.user.insertUser,[email, name, encryptedPassword])
        res.status(200).send({
            result: true,
            data: [],
            message: '회원 가입 성곡'
        })
      }else{
        res.status(201).send({
          result: true,
          data: [],
          message: '이메일 중복'
      })
      }
    }else{
      res.status(403).send({
        result: false,
        data: [],
        message: '입력한 정보 실패'
    })
    }
  } catch (error) {
    console.log(error)
  }
});

/* GET users listing. */
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;
  try {
    if(email && password)
    {
      var encryptedPassword = crypto.createHash('sha256').update(String(password)).digest('base64');
      const [row] = await db.query(sql.user.getUser,[email, encryptedPassword])
      if(row.length != 0){
        var token = jwt.sign({ _user: row }, process.env.TOKEN);
        res.header('auth-token', token).send({
          result: true,
          jwt: token,
          message: '로그인 성공'
        });
      }else{
        res.status(200).send({
          result: false,
          data: [],
          message: '로그인 실패'
        })
      }
    }else{
        console.log('로그인 실패합니다')
        res.status(403).send({
          result: false,
          data: [],
          message: '입력한 정보 실패'
        })
      }
  } catch (error) {
    console.log(error)
  }
});
/* GET users listing. */
router.get('/logout',authorizationAPI, async function(req, res, next) {
  try {
    res.status(200).send({
      result: true,
      data: [],
      message: '로그아웃 성공'
    })
  } catch (error) {
    console.log(error)
  }
});
module.exports = router;
