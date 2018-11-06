var express = require('express');
var router = express.Router();

var model = require("../../model/article");
var mongoose = require("mongoose");


/* Create a new article. */
router.post('/', function(req, res, next) {
    var domain = getDomain(req);
    var type = req.body.type;

    model.find({type: type, domain: domain }, 'id -_id', function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                sendJson(doc,res)
            }
        });
});


function getDomain(req) {
    var host = req.hostname;
    if (host == 'dev.91mitang.com' || host == 'localhost') {
        host = "www.91mitang.com";
    }
    return host;
}

function sendJson(rs, res) {
    res
        .type("json")
        .status(200)
        .json(rs);
}

module.exports = router;