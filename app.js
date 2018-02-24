const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs')
const mysql = require('mysql');

var app = express();
app.listen(8888);
console.log('成功监听8888端口')

// 1. 获取请求数据
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest:'./public/images/upload/'}).any());

// 2.cookie，session
app.use(cookieParser('12345'));
app.use(cookieSession({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
}))

// 3. 模板
app.set('view engine', 'html');
app.set('views', './views')
app.engine('html', ejs.__express)

// 4. router /main
app.use('/',require('./route/main/index.js'))

// /my
app.use('/my',require('./route/my/index.js'))

// admin/login
app.use('/admin',require('./route/admin/index.js'))

// api(ajax请求)
app.use('/api',require('./route/api/api.js'))

// 静态文件位置
app.use(express.static(path.join(__dirname, 'public')))