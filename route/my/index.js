const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();
  
  // my首页
  router.get('/', function(req, res) {
    
    res.render('my/index.ejs', {
      userInfo: req.userInfo
    })

  })
  
  // 个人资料
  router.use('/detail/', require('./detail'))
  // 文章管理
  router.use('/article/', require('./article'))
  // 我的评论
  router.use('/comment/', require('./comment'))

module.exports = router;