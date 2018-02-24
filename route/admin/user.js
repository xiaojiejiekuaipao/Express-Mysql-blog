const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  /* 从数据库中读取所有用户数据并展示
   * limit(int): 限制获取的数据条数以用于分页
   * count: 总条数
   * num : 每页显示条数,
   * pages: 总页数 = 总条数 / 每页显示条数
   * current_page: 当前页码,
   */
  router.get('/', function(req, res) {
    console.log(req.userInfo)
    var current_page = parseInt(req.query.page) || 1;
    var num = 4;
    var pages = 0;
    var count = 0;
    connection(db, 'SELECT COUNT(*) FROM user_table')
    .then(function (data) {
    	count = data[0]['COUNT(*)']
      pages = Math.ceil(count / num);
      current_page = Math.min(current_page, pages); // 当前页数最大不大于总页数
      current_page = Math.max(current_page, 1)     // 当前页数最小不小于1
      return connection(db, 'SELECT * FROM user_table limit ' + num + ' offset ' + num*(current_page-1));
    }).then(function (users) {
      res.render('admin/user_index.ejs', {
            url: req.baseUrl, // 当前url
            userInfo: req.userInfo,
            users: users,
            count: count,
            limit: num,
            pages: pages,
            current_page: current_page
          })
    }).catch(function (err) {
    	res.status(500).send('数据库出错').end()
    })
  })

module.exports = router;