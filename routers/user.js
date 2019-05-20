const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
// 載入 db 資料
const db = require('../models');
const User = db.User;

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register');
})

// 註冊檢查
router.post('/register', (req, res) => {
  // Step 1：解構賦值 (Object Destructuring Assignment)
  const {
    name,
    email,
    password,
    password2
  } = req.body;

  // 加入錯誤訊息
  let errors = [];
  // 1. 沒有填寫所有資料
  if (!name || !email || !password || !password2) {
    errors.push({
      message: '所有欄位都是必填，請再次填寫'
    });
  }
  // 2. 沒有填寫所有資料
  if (password !== password2) {
    errors.push({
      message: '密碼輸入不一樣，請再次確認'
    });
  }

  // 若有上述兩個錯誤訊息，則跳轉回註冊頁面，同時，傳入五種資料，以供畫面顯示
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } // 反之，則與資料庫比對使用者資訊
  else {
    User.findOne({
      where: {
        email: email,
      }
    }).then((user) => {
      // 若使用者 email 已存在，則跳出警示訊息
      if (user) {
        errors.push({
          message: '這個 Email 已經被使用過了'
        })
        // 同時，將表單資料會回傳至註冊頁面
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // 若使用者 email 不存在，則在使用者資料庫（User Database）新增他的資料
        // Step 1：建立新的一筆物件
        const newUser = new User({
          name,
          email,
          password,
        });

        // Step 2：To hash a password 湊雜使用者密碼
        // Step 2-1： 先用 genSalt 產生「鹽」，第一個參數是複雜度係數，預設值是 10
        bcrypt.genSalt(10, (err, salt) => {
          // Step 2-2： 再用 hash 把鹽跟使用者的密碼配再一起，然後產生雜湊處理後的 hash
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // Step 2-3： 依不同執行情況回應
            // Step 2-3-1： 以 throw 負責處理例外情況，如錯誤
            if (err) throw err;
            // Step 2-3-2： 若成功，則將使用者密碼賦予 hash 內容
            newUser.password = hash;
            // Step 2-4： 用 bcrypt 處理密碼後，再把它存入資料庫
            newUser
              .save()
              .then(user => {
                // 並將頁面轉址到 To-do List 首頁
                res.redirect('/');
              }).catch(err => {
                console.log(err);
              });
          })
        })
      };
    });
  };
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
  })(req, res, next);
})

// 登出
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', '你已經成功登出了');
  res.redirect('/users/login');
})

module.exports = router;