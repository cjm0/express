var express = require('express');
var router = express.Router();

var model = require("../../model/article");
var mongoose = require("mongoose");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('input');
});

module.exports = router;