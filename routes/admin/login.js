var express = require('express');
var router = express.Router();

var model = require("../../model/login");
var mongoose = require("mongoose");


// 登录
router.post('/', function(req, res, next) {

	res.set('Content-Type', 'application/json;charset=utf-8')

	if (req.body.username == 'admin' && req.body.password == '123') {
		res.type('json').status(200).json({"result": 1, "message": "登录成功"});
	} else { 
		res.type('json').status(200).json({"result": 0, "message": "登录失败"});
	}
		
});

module.exports = router;














