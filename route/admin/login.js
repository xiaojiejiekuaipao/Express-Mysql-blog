const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

	var router = express.Router();
	
	 // 设置/admin/login
  router.get('/', function (req, res) {
    res.render('admin/login.ejs')
    console.log('hehe')
  })
  // 提交表单后才进行登录操作
  router.post('/', function (req, res) {
    var username = req.body.username;
    // 将密码进行MD5加密,防止拖库泄露信息，一般需要递归加密几次
    var password = common.md5(req.body.password + common.MD5_SUFFIX);
    console.log(username)
    connection(db, 'SELECT * FROM user_table WHERE username = ?', [username])
    .then(function (data) {
      console.log(data)
    	if (data[0].password == password) {
    		req.session['admin_id'] = data[0].ID;
    		console.log('成功')
    		res.redirect('/admin/')
    	} else{
    		res.status(404).send('用户名或密码错误').end()
    	}
    }).catch(function (err) {
    	res.status(400).send('用户不存在').end()
    })
  })

	
module.exports = router;