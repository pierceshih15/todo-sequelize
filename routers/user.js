const express = require('express');
const router = express();
const passport = require('passport');
// 載入 db 資料
const db = require('../models');
const User = db.User;

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register');
})

// 註冊檢查
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  User.findOne({
    where: {
      email
    }
  }).then(user => {
    if (user) {
      console.log('User already exists');
      res.render('register', {
        name,
        email,
        password1,
        password2,
      })
    } else {
      const newUser = new User({
        name,
        email,
        password,
      })
      newUser
        .save()
        .then(user => {
          res.redirect('/')
        })
        .catch(err => console.log(err));
    }
  })
})

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login');
})

// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })(req, res, next)
})

// 登出
router.get('/logout', (req, res) => {
  res.send('logout');
})

module.exports = router;