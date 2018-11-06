var mongoose = require("mongoose");

// 创建规则
var rule = new mongoose.Schema({
    username: {type: String, default:'admin', require: true},
    password: {type: Number, default:111, require: true},
    time: {type: Date, default: Date.now}
});

// 把规则对应到一张具体的表，没有则创建
module.exports = db.model('logins', rule);



