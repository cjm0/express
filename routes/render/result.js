var express = require('express');
var router = express.Router();

var model = require("../../model/article");
var mongoose = require("mongoose");

/* GET home page. */
router.get('/', function(req, res, next) {
    var domain = getDomain(req);
    let config = require("../../conf/" + getDomain(req));

    var key = decodeURI(req.query.key);

    var queryCond = {
        domain: domain,
        $or: [{
                title: {
                    $regex: ".*" + key + ".*"
                }
            },
            {
                id: {
                    $regex: ".*" + key + ".*"
                }
            },
            {
                type: {
                    $regex: ".*" + key + ".*"
                }
            },
            {
                author: {
                    $regex: ".*" + key + ".*"
                }
            }
        ]
    }

    //console.log(queryCond);

    var briefInfo = " id title articleImgs readCount videoCount updatedAt createdAt hot videoUrl videoTime"
    model.find(queryCond, briefInfo)
        .limit(20)
        .sort({ hot: 'desc', updatedAt: 'desc', readCount: 'desc', videoCount: 'desc' })
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.render('result', { articles: docs, config: config});
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

module.exports = router;