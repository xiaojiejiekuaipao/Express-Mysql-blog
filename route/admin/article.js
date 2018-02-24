const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  // 设置/article
  router.get('/', function(req, res) {
    var data = {
      url: req.baseUrl,
      userInfo: req.userInfo,
      categoryType: req.query.type || '',
      current_page: parseInt(req.query.page) || 1,
      limit: 4,
      pages: 0,
      count: 0,
    }
    var countSql = '';
    var articleSql = '';
    // 根据文章分类查询该分类下所有文章的属性及总条数
    // 先查询文章总条数->再通过等值连接查询文章的具体属性
    if(data.categoryType == '') { // 分类为空即查询所有文章
      countSql = 'SELECT COUNT(*) FROM article_table';
      articleSql = 'SELECT article_table.*, category_table.category_name FROM category_table,article_table WHERE category_table.ID = article_table.category_id ORDER BY ID DESC ' +
        'limit ' + data.limit + ' offset ' + data.limit * (data.current_page - 1)
    } else {
      countSql = 'SELECT COUNT(*) FROM article_table WHERE category_id=' + data.categoryType;
      articleSql = 'SELECT article_table.*, category_table.category_name FROM category_table,article_table WHERE article_table.category_id=' + data.categoryType +
        ' AND category_table.ID = article_table.category_id ORDER BY ID DESC ' +
        'limit ' + data.limit + ' offset ' + data.limit * (data.current_page - 1)
    }

    var countPromise = connection(db, countSql);
    var articlePromise = connection(db, articleSql);

    Promise.all([countPromise, articlePromise])
      .then(function(result) {
        data.count = result[0][0]['COUNT(*)'];
        data.pages = Math.ceil(data.count / data.limit);
        
        var articles = result[1];
        // 格式化后台传入的时间戳
        for(var i = 0; i < articles.length; i++) {
          articles[i].post_time = common.formateDateTime(articles[i].post_time)
        }
        data.articles = articles;
        res.render('admin/article_index.ejs', data)
      }).catch(function(err) {
        console.log(err)
        res.status(500).send('数据库出错').end()
      })

  })
  // 修改文章
  router.get('/edit', function(req, res) {
    // 先查询分类信息是否存在
    var _id = req.query.id || '';
    var categoryList;
    connection(db, 'SELECT * FROM category_table')
      .then(function(categories) {
        categoryList = categories;
        return connection(db, 'SELECT * FROM article_table WHERE ID=?', [_id])
      }).then(function(article) {
        if(article == '') {
          res.render('admin/error.ejs', {
            userInfo: req.userInfo,
            msg: '该文章不存在'
          })
        } else {
          res.render('admin/article_edit.ejs', {
            userInfo: req.userInfo,
            article: article[0],
            category: categoryList
          })
        }
      })
  })

  router.post('/edit', function(req, res) {
    var _id = req.query.id || '';
    const username = req.userInfo.username;
    const category_id = req.body.category;
    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const post_time = parseInt(new Date() / 1000)
    if(category_id == '') {
      res.render('admin/error', {
        userInfo: req.userInfo,
        msg: '文章所属分类不能为空'
      })
    }
    // 更新数据库
    connection(db, 'UPDATE article_table SET username=?, category_id=?, title=?, description=?, content=?, post_time=? WHERE ID=?', [username, category_id, title, description, content, post_time, _id])
      .then(function(data) {
        res.render('admin/success.ejs', {
          userInfo: req.userInfo,
          msg: '文章修改成功!',
          url: '/admin/article'
        })
      })
  })

  // 文章删除
  router.get('/delete', function(req, res) {
    // 先查询分类信息是否存在
    var _id = req.query.id || '';
    connection(db, 'SELECT * FROM article_table WHERE ID=?', [_id])
      .then(function(article) {
        if(article == '') {
          res.render('admin/error.ejs', {
            userInfo: req.userInfo,
            msg: '该文章不存在'
          })
        } else {
          return connection(db, 'DELETE FROM article_table WHERE ID=?', [_id])
        }
      }).then(function() {
        res.render('admin/success.ejs', {
          userInfo: req.userInfo,
          msg: '删除文章成功',
          url: '/admin/article'
        });
      })

  })

  // 文章添加
  router.get('/add', function(req, res) {
    connection(db, 'SELECT * FROM category_table')
      .then(function(category) {
        res.render('admin/article_add.ejs', {
          userInfo: req.userInfo,
          category: category
        })
      })
  })

  router.post('/add', function(req, res) {
    const username = req.userInfo.username;
    const category_id = req.body.category;
    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const post_time = parseInt(new Date() / 1000)
    if(category_id == '') {
      res.render('admin/error', {
        userInfo: req.userInfo,
        msg: '文章所属分类不能为空'
      })
    }
    // 插入到数据库
    connection(db, 'INSERT INTO article_table (username,category_id,title,description,content,post_time) VALUES (?,?,?,?,?,?)', [username, category_id, title, description, content, post_time])
      .then(function(data) {
        res.render('admin/success.ejs', {
          userInfo: req.userInfo,
          msg: '文章提交成功!',
          url: '/admin/article'
        })
      })
  })

module.exports = router;
