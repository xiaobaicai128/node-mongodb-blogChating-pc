/*
* @Author: qiaoyong
* @Date:   2018-12-21 19:45:24
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-19 21:01:31
*/
const express = require('express');
const app = express();
const session = require('express-session');

const ejs = require('ejs');
const router = require('./router/router.js');
const fs = require('fs');

// 配置ejs模板
app.set('view engine', 'ejs');
// 加载静态资源
app.use(express.static('./public'));
//配置session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));
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
// 进入个人主页
app.get('/my', router.showMy);
// 修改个人信息
app.get('/info', router.showInfo);
// 修改头像
app.get('/changeAvatar', router.showChangeAvatar)
// 处理修改头像
app.post('/dosetavatar', router.doSetAvatar)
// 切图
app.get('/cut', router.showCut)
// 执行切图
app.get('/docut', router.doCut)
// 更新个人信息数据
app.post('/add', router.doAdd)
// 发言
app.post('/comment', router.doComment)
// ajax服务，得到comment
app.get('/getallcomment', router.getAllComment)
// 获得某个用户信息
app.get('/getuserinfo', router.getUserInfo)


// 报错页面
app.get('/sorry', router.showSorry)

// 监听端口
app.listen('4000');

