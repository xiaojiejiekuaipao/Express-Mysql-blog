const express = require('express');
const common = require('../../libs/common.js');
const pathLib = require('path');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  // 作为整个路由共享的数据
  var data = {}

  router.use(function(req, res, next) {
    data.userInfo = req.userInfo
    next();
  })
  // 个人资料页
  router.get('/', function(req, res) {
    data.url = req.baseUrl,

      connection(db, 'SELECT * FROM user_table WHERE ID=?', [data.userInfo.ID])
      .then(function(user) {
        data.user = user[0]
        res.render('my/my_detail.ejs', data)
      })
  })

  // 修改个人信息
  router.get('/edit', function(req, res) {
    if(data.user == '') {
      data.msg = '该用户不存在'
      res.render('my/error.ejs', data)
    } else {
      res.render('my/detail_edit.ejs', data)
    }

  })

  router.post('/edit', function(req, res) {
    data.sex = req.body.sex;
    data.age = req.body.age;
    data.hobby = req.body.hobby;
    
    if(req.files[0]) {
      // 文件拓展名
      var ext = pathLib.parse(req.files[0].originalname).ext
      var oldPath = req.files[0].path
      var newPath = req.files[0].path + ext;
      var newFileName = req.files[0].filename + ext;
    } else {
      var newFileName = null
    }
    if(newFileName) {
      // 如果上传新的文件 -> 添加文件后缀名  ->更新数据库信息
      file.renameFile(oldPath, newPath)
        .then(function() {
          connection(db, 'UPDATE user_table SET avatar=?,sex=?,age=?,hobby=? WHERE ID=?',
          [newFileName, data.sex, data.age, data.hobby, data.userInfo.ID])
            .then(function(result) {
              data.url = '/my/detail';
              data.msg = '个人信息修改成功!'
              res.render('my/success.ejs', data)
            })
        })
    } else { // 如果没有上传文件-> 直接更新数据库信息
      if(req.body.mod_id) { // 直接修改title和description
        connection(db, 'UPDATE user_table SET sex=?,age=?,hobby=? WHERE ID=?',
          [data.sex, data.age, data.hobby, data.userInfo.ID])
          .then(function(result) {
            data.url = '/my/detail';
            data.msg = '个人信息修改成功!'
            res.render('my/success.ejs', data)
          }).catch(function (err) {
          	console.log(err)
          	data.msg = '个人信息修改成功!失败'
          	res.render('my/error.ejs', data)
          })
      }
    }

  })

module.exports = router;