const express = require('express');
const router = express();
const passport = require('passport');
// 載入 db 資料
const db = require('../models');
const Todo = db.Todo;
const User = db.User;

const {
  authenticated
} = require('../config/auth');

// 首頁
router.get('/', authenticated, (req, res) => {
  const user = User.findByPk(req.user.id)
    .then((user) => {
      if (!user) {
        return res.error();
      }
      Todo.findAll({
          where: {
            UserId: req.user.id,
          }
        })
        .then(function (todos) {
          return res.render('index', {
            todos
          })
        })
    })
    .catch((error) => {
      return res.status(422).json(error);
    })
})

module.exports = router;