var mongoose = require("mongoose");

// 创建规则
var rule = new mongoose.Schema({
    name: {type: String, default: 'signNum'},
    num: {type: Number, default: 1, require: true},
    time: {type: Date, default: Date.now}
});

// 把规则对应到一张具体的表，没有则创建
module.exports = db.model('sign', rule);



