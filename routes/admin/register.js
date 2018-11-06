var express = require('express');
var router = express.Router();


var model = require("../../model/login");
var mongoose = require("mongoose");

// 注册
router.post('/', function(req, res, next) {
	res.set('Content-Type', 'application/json;charset=utf-8')
	
	var data;
	if (req.body.username && req.body.password) {
		data = {
			username: req.body.username,
			password: req.body.password
		}
	} else {
		data = {"username": "cjm", "password": 111}
	}

	model.findOne(data, function(err, doc) {
		if (err) {
			console.log(err)
		} else {
			if (doc.username) {
				res.json({"resault": 0, "msg": "已经注册过了"})
			} else {
			  	model.create(data, function(err, doc) {
					if (err) {
						console.log(err)
						res.type('json').status(500).json({"resault": 0, "msg": "创建失败", datas: null})
					} else {
						res.type('json').status(200).json({"resault": 1, "msg": "注册成功", datas: doc})
					}
			  	})
			}
			  	
		}
  	})

  	
  	
});
 
module.exports = router;
