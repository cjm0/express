var express = require('express');
var router = express.Router();

var config = require("../../conf/config")

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(config);
});

module.exports = router;