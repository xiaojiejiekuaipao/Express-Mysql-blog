const express = require('express');
const mysql = require('mysql');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection


var router = express.Router();
  
  // 检查登录状态
  router.use(function (req, res, next) {
  	if (!req.session['admin_id'] && req.url !='/login') { // 既没登录(没有session)又不是请求login页面(route添加了/admin)
  		res.redirect('/admin/login') // redirect地址不受route影响
  	} else {
  	  next()
  	}
  })
  router.use(function (req, res, next) {
  	var session = req.session['admin_id'];
    connection(db, 'SELECT * FROM user_table WHERE ID = ?', [session])
    .then(function (user) {
      if (user) {
        req.userInfo = user[0]
        next()
      } else{
        res.status(404).send('用户不存在').end()
      }
    }).catch(function (err) {
      console.log(err)
      res.status(500).send('数据库出错').end()
    })
  })
  // admin首页
  router.get('/', function (req, res) {
        res.render('admin/index.ejs', {userInfo: req.userInfo});
  })
  
  // login登录页
  router.use('/login/', require('./login'))
  // 用户列表页
  router.use('/user/', require('./user'))
  // 分类管理页
  router.use('/category/', require('./category'))
  // 内容管理页
  router.use('/article/', require('./article'))
  // 文章评论页
  router.use('/comment/', require('./comment'))
  
module.exports = router;