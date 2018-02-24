const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  
  var router = express.Router();
  // 定义同一返回格式
  var reponseData;
  router.use((req, res, next) => {
    reponseData = {
      code: 0,
      msg: ''
    }
    next();
  });
  
  // 用户注册
  router.post('/register', function (req, res) {
    var username = req.body.username;
    // 将密码进行MD5加密,防止拖库泄露信息，一般需要递归加密几次
    var password = common.md5(req.body.password + common.MD5_SUFFIX);
    console.log(username)
    connection(db, 'SELECT * FROM user_table WHERE username = ?', [username])
    .then(function (data) {
      console.log(data)
      if (data == 0){
        connection(db, 'INSERT INTO user_table (username, password) VALUES(?,?)',[username, password])
        .then(function (data) {
          reponseData = {code: 0, msg: '注册成功!' }
          res.json(reponseData)
        })
      }
      else if (data[0].username == username) {
        reponseData = {code: 1, msg: '用户已存在!' }
        res.json(reponseData).end()
      }
    })
  })
  
  // 用户登录
  router.get('/login', function (req, res, next) {
    res.send('hehe')
  })
  // 提交表单后才进行登录操作
  router.post('/login', function (req, res) {
    var username = req.body.username;
    // 将密码进行MD5加密,防止拖库泄露信息，一般需要递归加密几次
    var password = common.md5(req.body.password + common.MD5_SUFFIX);
    connection(db, 'SELECT * FROM user_table WHERE username = ?', [username])
    .then(function (data) {
      if (data[0].password == password) {
        req.userInfo = data[0]
        req.session['user_id'] = data[0].ID; // 存储普通用户session
        if (data[0].isAdmin){ // 判断如果为管理员， 则存储管理员session
          req.session['admin_id'] = data[0].ID;
        }
        reponseData = {code: 0, msg: '登录成功!'};
        reponseData.userInfo = {
          _id: data[0].ID,
          username: data[0].username
        }
        console.log('登录成功')
        res.send(reponseData)
      } else{
        reponseData = {code: 1, msg: '用户名或密码错误!'};
        res.send(reponseData)
      }
    }).catch(function (err) {
      reponseData = {code: 2, msg: '用户不存在!'};
      res.send(reponseData)
    })
  })
  
  // 用户登出
  router.get('/loginOut', function (req, res, next) {
    console.log('退出登录！')
    delete req.session['user_id']
    res.json(reponseData)
  })
  
  // 获取用户评论
  router.get('/comment', function (req, res, next) {
    var _id = req.query.article_id;
    console.log(_id)
    connection(db, 'SELECT * FROM comment_table WHERE article_id=?', [_id])
      .then(function(comments) {
        console.log(comments)
        reponseData.msg = '成功获取评论！';
        // 格式化后台传入的时间戳
        for(var i = 0;i<comments.length;i++){
          comments[i].comment_time = common.formateDateTime(comments[i].comment_time)
        }
        res.json({
          reponseData,
          commentList: comments
        })
      })
  })

  // 提交评论
  router.post('/comment', function(req, res) {
    var _id = req.body.article_id;
    var data = {
      username: req.userInfo.username,
      postTime: parseInt(new Date() / 1000),
      content: req.body.commentContent
    }
    connection(db, 'INSERT INTO comment_table (username, article_id, comment_time, content) VALUES (?,?,?,?)', [data.username, _id, data.postTime, data.content])
      .then(function(data) {
        reponseData.msg = '评论成功!'
        console.log(data)
        res.json({reponseData})
      })
  })
  

module.exports = router;