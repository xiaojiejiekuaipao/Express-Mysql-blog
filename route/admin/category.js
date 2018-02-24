const express = require('express');
const common = require('../../libs/common.js');
const mysql = require('mysql');
const file = require('../../libs/file');
const DB = require('../../libs/db');
const db = mysql.createPool(DB.config)
const connection = DB.connection

  var router = express.Router();

  // 分类首页
  router.get('/', function(req, res) {
    var data = {
      url: req.baseUrl,
      userInfo: req.userInfo,
      current_page: parseInt(req.query.page) || 1,
      limit: 4,
      pages: 0,
      count: 0,
    }
    var countPromise = connection(db, 'SELECT COUNT(*) FROM category_table');
    var categoryPromise = connection(db, 'SELECT * FROM category_table ORDER BY ID DESC '+'limit ' + data.limit + ' offset ' + data.limit * (data.current_page - 1));
    
    Promise.all([countPromise, categoryPromise])
    .then(function (result) {
    	console.log(result); // result[0]存储第一个promise返回的结果， result[1]存储第二个promise返回的结果
    	data.count = result[0][0]['COUNT(*)']
      data.pages = Math.ceil(data.count / data.limit);
      
      data.categorys = result[1];
      res.render('admin/category_index.ejs', data)
      
    }).catch(function(err) {
        res.status(500).send('数据库出错').end()
      })
    
  })
  // 分类修改
  router.get('/edit', function (req, res) {
  	// 先查询分类信息是否存在
  	var _id = req.query.id || '';
  	connection(db, 'SELECT * FROM category_table WHERE ID=?', [_id])
  	.then(function (category) {
  		if (category == '') {
  			res.render('admin/error.ejs', {
  			  userInfo: req.userInfo,
  			  msg: '该分类不存在'
  			})
  		} else {
  		  res.render('admin/category_edit.ejs', {
  		    userInfo: req.userInfo,
  		    category: category[0]
  		  })
  		}
  	})
  })
  
  router.post('/edit', function (req, res) {
  	var _id = req.query.id || '';
  	var name = req.body.name;
  	connection(db, 'SELECT * FROM category_table WHERE ID=?', [_id])
  	.then(function (category) {
  		if (category == '') {
        res.render('admin/error.ejs', {
          userInfo: req.userInfo,
          msg: '该分类不存在'
        })
    } else {
      console.log(category[0])
        if(category[0].category_name == name) { // 当新旧名称相同则不用修改
          res.render('admin/success.ejs', {
            userInfo: req.userInfo,
            msg: '分类修改成功!',
            url: '/admin/category'
          })
        } else {
          // 根据新名称查询数据库是否存在其他同名分类
          return connection(db, 'SELECT * FROM category_table WHERE category_name=?', [name])
        }
     }
  	}).then(function (sameCategory) {
  	  if(sameCategory == ''){
  	    return connection(db, 'UPDATE category_table SET category_name=? WHERE ID=?', [name, _id])
  	  } else {
  	      if (sameCategory[0].category_name == name) {
            res.render('admin/error.ejs', {
            userInfo: req.userInfo,
            msg: '该分类已存在'
           })
         } 
  	   }
      }).then(function(newCategory) {
        if(newCategory) {
          res.render('admin/success.ejs', {
            userInfo: req.userInfo,
            msg: '分类修改成功!',
            url: '/admin/category'
          })
        }
      }).catch(function (err) {
      	console.log(err)
      })
  	
  })
  // 分类删除
  router.get('/delete', function (req, res) {
    // 先查询分类信息是否存在
    var _id = req.query.id || '';
    connection(db, 'SELECT * FROM category_table WHERE ID=?', [_id])
    .then(function (category) {
      if (category == '') {
        res.render('admin/error.ejs', {
          userInfo: req.userInfo,
          msg: '该分类不存在'
        })
      } else {
        return connection(db, 'DELETE FROM category_table WHERE ID=?', [_id])
      }
    }).then(function () {
    	res.render('admin/success.ejs',{
            userInfo: req.userInfo,
            msg: '删除分类成功',
            url: '/admin/category'
        }); 
    })
    
  })
  
  // 分类添加
  router.get('/add', function(req, res) {
    res.render('admin/category_add.ejs', {
      userInfo: req.userInfo
    })
  })
  // 分类提交
  router.post('/add', function(req, res) {
    var category_name = req.body.name;
    console.log(category_name)
    connection(db, 'SELECT * FROM category_table WHERE category_name=?', [categroy_name])
      .then(function(sameCategory) {
        console.log(sameCategory)
        if(sameCategory == ''){
        return connection(db, 'INSERT INTO category_table (category_name) VALUES(?)', [categroy_name])
        } else {
          if (sameCategory[0].category_name == name) {
            res.render('admin/error.ejs', {
            userInfo: req.userInfo,
            msg: '该分类已存在'
           })
         } 
       }
      }).then(function(newCategory) {
        if(newCategory) {
          res.render('admin/success.ejs', {
            userInfo: req.userInfo,
            msg: '分类添加成功!',
            url: '/admin/category'
          })
        }
      }).catch(function(err) {
        console.log(err)
        res.status(500).send('数据库出错').end()
      })
  })
  
module.exports = router;