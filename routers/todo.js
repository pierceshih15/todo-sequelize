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
  res.send('顯示全部 Todo');
})

// 新增 Todo 動作
router.post('/', authenticated, (req, res) => {
  res.send('顯示全部 Todo');
})

// 查看單一筆 Todo 詳細資訊頁面
router.get('/:id', authenticated, (req, res) => {
  res.send('查看單一筆 Todo');
})

// 修改 Todo 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  res.send('編輯一筆 Todo');
})

// 修改 Todo 動作
router.put('/:id', authenticated, (req, res) => {
  res.send('編輯一筆 Todo');
})

// 刪除 Todo 動作
router.delete('/:id/delte', authenticated, (req, res) => {
  res.send('刪除一筆 Todo');
})

module.exports = router;