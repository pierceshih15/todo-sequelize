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
  res.send('顯示全部 Todo');
})

module.exports = router;