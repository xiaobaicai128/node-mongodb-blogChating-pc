/*
* @Author: qiaoyong
* @Date:   2019-01-02 21:12:05
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-05 21:19:29
*/
// 建立数据库
var MongoClient = require('mongodb').MongoClient;
//链接数据库
function _connectDB(callback) {
	// var url = 'mongodb://127.0.0.1:27017/pengyouquan';
	let url = 'mongodb://127.0.0.1:27017/forum';
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client){
		// let db = client.db('forum');
		if(err){
			callback(err, client);
			return;
		}
		callback(err, client);
	})
}
init();
function init(){
	_connectDB((err, client) => {
		let db = client.db('forum');

		if(err) {
			console.log(err);
			return;
		}
		db.collection('forum').createIndex({'username': 1}, null, (err, result) => {
			console.log('创建索引')
		})
	})
}
// 封装插入函数
exports.insertOne = function(collectionName, json, callback){
	//调用内部函数 链接数据库
	_connectDB((err, client) => {
		let db = client.db('forum');

		db.collection(collectionName).insertOne(json, (err, result) => {
			callback(err, result);
			client.close();
		})
	})
}
// 封装查询函数

exports.find = function(collectionName, json, callback){
	_connectDB((err, client) => {
		let db = client.db('forum');

		let result = []; //设置接受结果的数组

		let rel = db.collection(collectionName).find(json);
		rel.each((err, doc) => {
			console.log(doc)
			if(err){
				callback(err, null);
				client.close();
				return;
			}
			console.log(doc)
			if(doc != null){
				result.push(doc); // 循环遍历文档，将所有的文档都保存到结果数组中
			} else {
				callback(null, result); // 将结果返回
				client.close();
			}
		})

		// rel.forEach((val, index, arr) => {
		// 	if(val != null){
		// 		result.push(val);
		// 		callback(null, result);
		// 		client.close();	
		// 	} else  {
		// 		callback(null, result);
		// 		client.close();
		// 	}
		// })
	})
	
}