var Schema = require('mongoose').Schema;

var ArticleSchema = Schema({
    name: { type: String, required: true },
    sex: { type: String, required: true },
    area: { type: String, required: true },
    tel: { type: String, required: true },
    wx: { type: String, required: true },
    money: { type: String, required: true },
    has: { type: String, required: true },
    yes: { type: String, required: true }  
}, {
    timestamps: true
});

/* global db */
module.exports = db.model('Input', ArticleSchema);

