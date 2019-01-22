/*
* @Author: qiaoyong
* @Date:   2018-12-21 19:53:22
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-22 22:31:06
*/
const db = require('../model/db.js')
const formidable = require('formidable');
// const session = require('express-session')
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const gm = require('gm');


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
				req.session.avatar = result[0].avatar || 'default.jpg';
				req.session.birthday = result[0].birthday || '';
				req.session.localtion = result[0].localtion || '';
				req.session.gender = result[0].gender || '';
				// console.log(result[0]._id)
				// console.log(req.session.oid)

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
						req.session.avatar = result.ops[0].avatar || 'default.jpg';
						// req.session.birthday = result[0].birthday || '';
						// req.session.localtion = result[0].localtion || '';
						// req.session.gender = result[0].gender || '';

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
		'username': req.session.login == 3 ? req.session.username : '游客',
		'avatar' : req.session.login === 3 ? req.session.avatar : 'default.jpg'
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
		'avatar' : req.session.login === 3 ? req.session.avatar : 'default.jpg',
		'say': req.session.say,
		'birthday': req.session.birthday,
		'gender': req.session.gender,
		'localtion': req.session.localtion
	})
}
//进入个人信息页面
exports.showInfo = function(req, res, next){
	res.render('info.ejs', {
		'username':req.session.username,
		'avatar' : req.session.login === 3 ? req.session.avatar : 'default.jpg',
		'say': req.session.say
	})
}
// 显示修改头像页面
exports.showChangeAvatar = function(req, res, next){
	res.render('avatar.ejs', {
		'username': req.session.username,
		'avatar' : req.session.login === 3 ? req.session.avatar : 'default.jpg'
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
		// console.log(newPath)

		//使用fs.rename()方法对其进行改名的操作，使其上传之后的文件名与之前的保持一致，并且包含后缀名的部分。
		fs.rename(oldPath, newPath, (err) => {
			if(err){
				next();
				return;
			} 
				req.session.avatar = req.session.oid + extname; //重新写入session
				console.log(req.session.avatar)
				res.redirect('/cut'); //跳转路由
			
		})
	})
}
// 处理切图
exports.showCut = function(req, res, next){
	res.render('cut.ejs', {
		// 'avatar': req.session.avatar,
		'avatar' : req.session.login === 3 ? req.session.avatar : 'default.jpg'
	})
}
//执行切图
exports.doCut = function(req, res, next){
	//使用get上传的数据：
	let fileName = req.session.avatar; //保持源文件名字不变
	//get上传的数据，从req.query获得
	let w = req.query.w;
	let h = req.query.h;
	let x = req.query.x;
	let y = req.query.y;
	//利用gm模块，裁剪图片
	gm('./public/avatar/' + fileName) // 将文件夹下的图片进行裁剪
	.crop(w,h,x,y) // 执行裁剪（裁剪后的宽度，高度，坐标x，y）
	.resize(100, 100, '!') // 缩放比例 ‘！’可省略，强制执行
	.write('./public/avatar/' + fileName, (err, result) => { // 储存裁剪厚的图片，并执行回调
		if(err){
			res.send('-4');
			return;
		}
		db.updateMany('forum', {'username': req.session.username}, {$set: {'avatar': req.session.avatar}}, (err, result) => {
			if(err){
				next();
				return;
			}
			res.send('4')
		})
	})
}
// 更新个人信息数据
exports.doAdd = function(req, res, next){
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if(err){
			next();
			return;
		} else {
			db.updateMany('forum', {'username': req.session.username}, {$set: {
				'username': fields.username,
				'gender': fields.gender,
				'say': fields.say,
				'country': fields.country,
				'localtion': fields.localtion,
				'birthday': fields.birthday
			}}, (err, result) => {
				if(err){
					next();
					return
				} else {
					req.session.say = fields.say;
					req.session.birthday = fields.birthday;
					req.session.gender = fields.gender;
					req.session.localtion = fields.localtion;

					res.send('5') // 更新成功
				}
			})
		}
	})

}
// 处理发言
exports.doComment = function(req, res, next){
	// 时间格式转变
	function formateDate(date){
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let d = date.getDay();
		m = m < 10 ? ('0'+m) : m;
		d = d < 10 ? ('0'+d) : d;
		let h = date.getHours();
		let mm = date.getMinutes(); 
		let s = date.getSeconds();
		h = h < 10 ? ('0'+h) : h;
		mm = mm < 10 ? ('0'+mm) : mm;
		s = s < 10 ? ('0'+s) :s;
		let time = `${y}-${m}-${d} ${h}:${mm}:${s}`;
		return time;
	}
	

	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if(err){
			next();
			return;
		} else {
			let time = formateDate(new Date())
			console.log(time)
			// 将评论发表到另一个数据库中
			db.insertOne('comment', {'username': req.session.username, 'date': formateDate(new Date()), 'comment': fields.comment}, (err, result) => {
				if(err){
					res.send('-6');
					next();
				} else{
					res.send('6');
				}
			})
		}
	})
}
// 得到所有发言
exports.getAllComment = function(req, res, next){
	let page = req.query.page;
	db.find('comment',{}, {'pageamount':6,'page':page,'sort':{'date':-1}}, (err, result) => {// 按时间date倒序
			if(err){
				next();
				return;
			} else {
				res.json(result);
			}
	})
}
//得到某个用户的信息
exports.getUserInfo = function(req, res, next){
	let username = req.query.username;
	db.find('forum', {'username': username}, (err, result) => {
		if(err || result.length == 0){
			res.json('');
			next();
		} else {
			res.json(result);
		}
	})
}











// 报错页面
exports.showSorry = function(req, res, next){
	res.render('sorry.ejs');
}