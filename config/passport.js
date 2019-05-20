const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// 載入 db 資料
const db = require('../models');
const User = db.User;

module.exports = passport => {
  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, (email, password, done) => {
      User.findOne({
          where: {
            email: email
          }
        })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'That email is not registered.'
            });
          }
          // 用 bcrypt 來比較「使用者輸入的密碼」跟在使用者資料庫的密碼是否是同一組字串
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: 'Email or Password incorrect.'
              });
            }
          })
        });
    })
  )

  // Facebook 註冊
  // Step 1：設定 Passport strategies 認證策略語法
  passport.use(
    new FacebookStrategy({
        // Step 1：設定 Facebook for Developer 所需的四個參數
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      // Step 2：回傳 accessToken, refreshToken, profile 資訊
      (accessToken, refreshToken, profile, done) => {
        // Step 3：找出或是建立使用者資料，以 email 為判斷資訊
        User
          .findOne({
            email: profile._json.email,
          })
          .then(user => {
            // Step 3-1：如果 email 不存在就建立新的使用者
            if (!user) {
              // Step 3-1-1：隨機從 36 位元字串中，取出最後八碼的字串
              let randomPassword = Math.random().toString(36).slice(-8);
              // Step 3-1-2：將字串以 bcrypt 方式湊雜密碼
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(randomPassword, salt, (err, hash) => {
                  // Step 3-1-3：建立使用者資料
                  var newUser = User({
                    name: profile._json.name,
                    email: profile._json.email,
                    // 暫時密碼
                    password: hash,
                  })
                  // Step 3-1-4：將使用者資料存入資料庫
                  newUser.save().then(user => {
                    return done(null, user);
                  }).catch(err => {
                    console.log(err);
                  })
                })
              })
            } else {
              // Step 3-2：若存在，則直接回傳使用者資訊
              return done(null, user);
            }
          });
      })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
      done(null, user)
    })
  })
}