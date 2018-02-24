const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  // comment评论
  router.get('/', function(req, res) {
    var data = {
      url: req.baseUrl,
      userInfo: req.userInfo,
      articleType: req.query.type || '',
      current_page: parseInt(req.query.page) || 1,
      limit: 4,
      pages: 0,
      count: 0,
    }
    var countSql = '';
    var commentSql = '';
    // 根据文章分类查询该分类下所有文章的属性及总条数
    // 先查询文章总条数->再通过等值连接查询文章的具体属性
    if(data.articleType == '') { // 分类为空即查询所有文章
      countSql = 'SELECT COUNT(*) FROM comment_table';
      commentSql = 'SELECT comment_table.*,article_table.title,category_table.category_name FROM category_table,article_table,comment_table '+
                   'WHERE comment_table.article_id = article_table.ID AND article_table.category_id=category_table.ID ORDER BY ID DESC ' +
                   'limit ' + data.limit + ' offset ' + data.limit * (data.current_page - 1)
    } else {
      countSql = 'SELECT COUNT(*) FROM comment_table WHERE article_id=' + data.articleType;
      commentSql = 'SELECT comment_table.*,article_table.title,category_table.category_name FROM category_table,article_table,comment_table '+
                   'WHERE comment_table.article_id='+data.articleType+' AND comment_table.article_id = article_table.ID AND article_table.category_id=category_table.ID ORDER BY ID DESC ' +
                   'limit ' + data.limit + ' offset ' + data.limit * (data.current_page - 1)
    }
    
    var countPromise = connection(db, countSql);
    var commentPromise = connection(db, commentSql);
    
    Promise.all([countPromise, commentPromise])
      .then(function(result) {
        data.count = result[0][0]['COUNT(*)'];
        data.pages = Math.ceil(data.count / data.limit);
        
        var comments = result[1];
        // 格式化后台传入的时间戳
        for(var i = 0; i < comments.length; i++) {
          comments[i].comment_time = common.formateDateTime(comments[i].comment_time)
        }
        data.comments = comments;
        res.render('admin/comment_index.ejs', data)
      }).catch(function(err) {
        console.log(err)
        res.status(500).send('数据库出错').end()
      })
    
  })
  
  // 评论删除
  router.get('/delete', function (req, res) {
    // 先查询分类信息是否存在
    var _id = req.query.id || '';
    connection(db, 'SELECT * FROM comment_table WHERE ID=?', [_id])
    .then(function (article) {
      if (article == '') {
        res.render('admin/error.ejs', {
          userInfo: req.userInfo,
          msg: '该文章不存在'
        })
      } else {
        return connection(db, 'DELETE FROM comment_table WHERE ID=?', [_id])
      }
    }).then(function () {
      res.render('admin/success.ejs',{
            userInfo: req.userInfo,
            msg: '删除评论成功',
            url: '/admin/comment'
        }); 
    })
    
  })

module.exports = router