/*
* @Author: qiaoyong
* @Date:   2018-12-21 19:45:24
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-12-25 19:57:36
*/
let express = require('express');
let app = express();

let ejs = require('ejs');
let router = require('./router/router.js');
let fs = require('fs');

// 配置ejs模板
app.set('view engine', 'ejs');
// 加载静态资源
app.use(express.static('./public'));

// 设置主页
app.get('/', router.showIndex);
//登录页面
app.get('/login', router.showLogin);
//数据库用户检测
app.post('/dologin', router.doLogin);
//新用户注册
app.get('/resign', router.showResign);
//执行注册，查询数据库并返回注册结果
app.post('/doregist', router.doRegist);
// 进入主页面
app.get('/main', router.showMain);


// 监听端口
app.listen('3000');

