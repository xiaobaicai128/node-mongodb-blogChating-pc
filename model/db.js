/*
* @Author: qiaoyong
* @Date:   2019-01-02 21:12:05
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2019-01-19 17:02:43
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

exports.find = function(collectionName, json, argumentC, argumentD){
	// 因为arguments的数量时可变的，不确定的。所以先判断参数的个数 3个或者4个
	if(arguments.length === 3){
		// 那么此时没有参数D
		var callback = argumentC;
		var skipNumber = 0; // 用于跳页
		var limit = 0; // 限制每页的数量
	} else if(arguments.length === 4){
		var callback = argumentD;
		var args = argumentC; // 将argumentC作为json传参
		// 省略的条数 = 每页显示的数量*页数
		var skipNumber = args.pagemount * args.page || 0;
		var limit = args.pagemount || 0;
		var sort = args.sort || {}; // 排序方式
	} else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }
	
	_connectDB((err, client) => {
		let db = client.db('forum');

		let result = []; //设置接受结果的数组

		let rel = db.collection(collectionName).find(json).limit(limit).skip(skipNumber).sort(sort);
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
//封装数据更新函数
// json1：筛选条件
// json2：更新哪些字段 参数2需要使用$set操作
// 参数3：如果没有筛选到符合条件的记录，是否需要将参数2插入到集合中，默认false，不插入
// 参数4：默认false，一次更新一条；true一次更新多条，此时参数2需要使用$set操作
exports.updateMany = function(collectionName, json1, json2, callback){
	_connectDB((err, client) => {
		let db = client.db('forum');
		db.collection(collectionName).updateMany(json1, json2, (err, result) => {
			if(err){
				callback(err, null);
				client.close();
				return;
			} else {
				callback(null, result);
				client.close();
			}
		})
	})
}