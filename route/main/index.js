const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  // 判断是否登录
  router.use(function(req, res, next) {
    var session = req.session['user_id'];
    // 保存共享数据的全局变量
    req.data = {}
    req.userInfo = {};
    connection(db, 'SELECT * FROM user_table WHERE ID = ?', [session])
      .then(function(user) {
        if(user) {
          req.userInfo = user[0]
          next()
        } else {
          res.status(404).send('用户不存在').end()
        }
      }).catch(function(err) {
        res.status(500).send('数据库出错').end()
      })
  })
  /*
   * 由于每个页面都需要分类等信息，所以需要使用中间件和全局数据来保存共享的信息
   * 先查询获取所有分类，在进行下一步操作
   */
  router.use(function(req, res, next) {
    req.data = {
      categories: []
    };
    connection(db, 'SELECT * FROM category_table')
      .then(function(categories) {
        req.data.categories = categories;
        next()
      })
  })
  // admin首页
  router.get('/', function(req, res) {
    // 由于多次查询数据库，所以将数据临时保存在一个对象中传递
    var data = {
      userInfo: req.userInfo,
      categories: req.data.categories,
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
      articleSql = 'SELECT article_table.*, category_table.category_name FROM category_table,article_table WHERE article_table.category_id='+data.categoryType+
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
        res.render('main/index.ejs', data)
      }).catch(function(err) {
        console.log(err)
        res.status(500).send('数据库出错').end()
      })
    

  })
  // 文章详情页
  router.use('/views/', require('./views'))

module.exports = router;