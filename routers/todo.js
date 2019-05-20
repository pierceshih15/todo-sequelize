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

// 新增 Todo 頁面
router.get('/new', authenticated, (req, res) => {
  return res.render('new');
})

// 新增 Todo 動作
router.post('/', authenticated, (req, res) => {
  Todo.create({
      name: req.body.name,
      userId: req.user.id,
      done: false,
    })
    .then(todo => {
      return res.redirect('/');
    })
    .catch(err => {
      return res.status(422).json(err);
    })
})

// 查看單一筆 Todo 詳細資訊頁面
router.get('/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res.error();
      }
      Todo.findOne({
          where: {
            userId: req.user.id,
            id: req.params.id
          }
        })
        .then(todo => {
          return res.render('detail', {
            todo
          });
        })
        .catch(err => {
          return res.status(422).json(err);
        })
    })
})

// 修改 Todo 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res.error();
      }
      Todo.findOne({
          where: {
            userId: req.user.id,
            id: req.params.id
          }
        })
        .then(todo => {
          return res.render('edit', {
            todo
          });
        })
    })
})

// 修改 Todo 動作
router.put('/:id', authenticated, (req, res) => {
  Todo.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id
      }
    })
    .then(todo => {
      todo.name = req.body.name;
      if (req.body.done === 'on') {
        todo.done = true;
      } else {
        todo.done = false;
      }

      todo.save()
        .then(todo => {
          return res.redirect(`/todos/${req.params.id}`);
        })
        .catch(err => {
          return res.status(422).json(err);
        })
    })
})

// 刪除 Todo 動作
router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res.error();
      }
      Todo.destroy({
          where: {
            userId: req.user.id,
            id: req.params.id
          }
        })
        .then(todo => {
          return res.redirect('/');
        })
        .catch(err => {
          return res.status(422).json(err);
        })
    })
})

module.exports = router;