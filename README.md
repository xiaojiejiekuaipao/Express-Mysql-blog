# Express-Mysql-project

> A Node.js project 使用Express和Mysql搭建的简单博客及后台系统

### 运行项目

1、先安装mysql数据库，然后创建用户名为user，密码为123456的用户，新建名为learn数据库,将sql文件的数据导入该数据库中<br>

2、进入项目目录， 运行npm install <br>

3、node app.js 运行项目 // 启动express服务器

4、在浏览器输入localhost:8088即跳转到博客首页，localhost:8088/admin是博客后台管理系统



> 项目文件列表

```
| - BlogImg  -- 项目页面效果截图
| - libs     -- 自定义方法库
| - public   -- 静态html,css,js等资源文件
| - route    -- express后台路由端口
    | - admin         --  后台管理相关
        | - article.js    -- 文章内容接口
        | - category.js   -- 文章分类接口
        | - comment.js    -- 文章评论接口
        | - index.js      -- 后台首页接口
        | - login.js      -- 后台登录接口
    | - api           --  前端ajax请求接口
    | - main          --  博客首页相关
        | - index.js      --  博客首页接口
        | - views.js      --  文章详情接口
    | - my            --  个人中心相关
        | - article.js    --  我的文章接口
        | - comment.js    --  文章或我的评论接口
        | - detail.js     --  个人资料接口
        | - index.js      --  个人中心首页接口
| - views    -- 网页ejs模板相关
| - sql      -- 项目sql数据
| - app.js   -- 项目启动入口

```


### 项目效果展示

>### 后台管理系统登录页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/login.png)
 <br/>
 <br/>
>### 用户列表页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/userLists.png)
 <br/>
 <br/>
>### 文章分类页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/categoryList.png)
 <br/>
 <br/>
>### 文章列表页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/articlesList.png)
 <br/>
 <br/>
>### 文章评论页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/commentLists.png)
 <br/>
 <br/>
>### 博客首页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/blogIndex.png)
 <br/>
 <br/>
>### 博客文章详情页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/articleIndex.png)
 <br/>
 <br/>
>### 个人资料页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/myDetail.png)
 <br/>
 <br/>
>### 我的文章页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/myArticles.png)
 <br/>
 <br/>
>### 我的评论页
![image](https://github.com/xiaojiejiekuaipao/Express-Mysql-blog/blob/master/BlogImg/my_comments.png)
 <br/>
 <br/>

