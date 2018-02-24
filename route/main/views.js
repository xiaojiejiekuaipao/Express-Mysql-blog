const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

	var router = express.Router();
	
	router.get('/', function (req, res) {
		var _id = req.query.articleID;
		var data = {
		  userInfo: req.userInfo,
      categories: req.data.categories
		}
		var updateViewSql = 'UPDATE article_table SET n_view=n_view+1 WHERE ID=?';
    var articleSql = 'SELECT * FROM article_table WHERE ID=?';
		
		var viewPromise = connection(db, updateViewSql, [_id]);
    var articlePromise = connection(db, articleSql, [_id]);

    Promise.all([updateViewSql, articlePromise])
      .then(function(result) {
        data.count = result[0][0]['COUNT(*)'];
        data.pages = Math.ceil(data.count / data.limit);
        
        var article = result[1][0];
        // 格式化后台传入的时间戳
        article.post_time = common.formateDateTime(article.post_time)
        
        data.article = article;
        res.render('main/article_detail.ejs', data)
      }).catch(function(err) {
        console.log(err)
        res.status(500).send('数据库出错').end()
      })
		
	})
	
module.exports = router;