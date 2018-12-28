/*
* @Author: qiaoyong
* @Date:   2018-12-21 19:53:22
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-12-25 19:58:06
*/
exports.showIndex = function(req, res, next){
	res.render('index.ejs');
}
exports.showLogin = function(req, res,next){
	res.render('login.ejs');
}
//检测用户是否正确
exports.doLogin = function(req, res, next) {
	//查询数据库
	res.send('1');
}
//显示注册页面
exports.showResign = function(req, res, next) {
	res.render('resign.ejs');
}
// 执行注册
exports.doRegist = function(req, res, next){
	// 查询数据库
	res.send('1')
}
// 进入主页面
exports.showMain = function(req, res, next) {
	res.render('main.ejs');
}