/*
* @Author: qiaoyong
* @Date:   2018-12-21 19:53:22
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-12 21:10:16
*/
const db = require('../model/db.js')
const formidable = require('formidable');
// const session = require('express-session')
const session = require('express-session');
const path = require('path');
const fs = require('fs');



exports.showIndex = function(req, res, next){
	res.render('index.ejs');
}
exports.showLogin = function(req, res,next){
	res.render('login.ejs');
}
//检测用户是否正确
exports.doLogin = function(req, res, next) {
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		//查询数据库
		db.find('forum', {'username': fields.username}, (err, result) => {
			if(err) {
				next();
				return;
			} else if (result.length === 0){
				res.send('-1'); // 未注册
				return;
			} else if(fields.password === result[0].password) {
				//写入session  一定要写在send之前
				req.session.login = 3;
				req.session.username = fields.username;
				req.session.oid = result[0]._id;
				console.log(result[0]._id)
				console.log(req.session.oid)

				res.send('2') // 登陆成功
			} else {
				res.send('-2'); // 密码错误
			}
		})
	})
}
//显示注册页面
exports.showResign = function(req, res, next) {
	res.render('resign.ejs');
}
// 执行注册
exports.doRegist = function(req, res, next){
	// 查询数据库
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		db.find('forum', {'username':fields.username}, (err, result) => {
			if(err) {
				next();
				return;
			} else if(result.length === 0){ // 该用户名没有被占用
				db.insertOne('forum', {'username': fields.username, 'password':fields.password, 'avatar':'default.jpg'}, (err, result) => {
					if(err){
						res.send('-2');//注册失败
						return;
					} else {
						//写入session  一定要写在send之前
						req.session.login = 3;
						req.session.username = fields.username;
						req.session.oid = result.ops[0]._id;
						res.send('1'); // 注册成功
					}
					
				})
			} else {
				res.send('-1'); // 已被注册
				return;
			}
		})
	})
}
// 进入主页面
exports.showMain = function(req, res, next) {
	res.render('main.ejs', {
		'username': req.session.login == 3 ? req.session.username : '游客'
	});
}
//个人主页
exports.showMy = function(req, res, next){
	// if(req.session.login === 3){
	// 	res.render('my.ejs', {
	// 		'username': req.session.login === 3 ? req.session.username : '游客'
	// 	});
	// } else {
	// 	res.send('请先登录');
	// 	return;
	// }
	res.render('my.ejs', {
		'username': req.session.username,
		'say':'何时杖尔看南雪，我与梅花两白头'
	})
}
//进入个人信息页面
exports.showInfo = function(req, res, next){
	res.render('info.ejs', {
		'username':req.session.username,
		'say':'何时杖尔看南雪，我与梅花两白头'
	})
}
// 显示修改头像页面
exports.showChangeAvatar = function(req, res, next){
	res.render('avatar.ejs', {
		'username': req.session.username
	})
}
// 处理上传头像
exports.doSetAvatar = function(req, res, next){
	let form = new formidable.IncomingForm();
	// 设置上传文件夹
	form.uploadDir = './public/avatar'; //用于设置文件或图片上传的存放路径，为绝对物理路径
	//以post方式提交的表单域数据都放在fields这个对象当中，以post方式上传的文件、图片等文件域数据都放在files
	form.parse(req, (err, fields, files) => {
		//返回path路径文件扩展名，如果path以 ‘.' 为结尾，将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
		let extname = path.extname(files.avatar.name);
		let oldPath = files.avatar.path;
		let newPath = './public/avatar' + '/' + req.session.oid + extname;
		console.log(newPath)

		//使用fs.rename()方法对其进行改名的操作，使其上传之后的文件名与之前的保持一致，并且包含后缀名的部分。
		fs.rename(oldPath, newPath, (err) => {
			if(err){
				next();
				return;
			} 
				req.session.avatar = req.session.oid + extname; //写入session
				console.log(req.session.avatar)
				res.redirect('/cut'); //跳转路由
			
		})
	})
}
// 处理切图
exports.showCut = function(req, res, next){
	res.render('cut.ejs', {
		'avatar': req.session.avatar
	})
}
//执行切图
exports.doCut = function(req, res, next){
	res.send('11')
}