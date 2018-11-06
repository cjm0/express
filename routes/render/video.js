var express = require('express');
var router = express.Router();

var model = require("../../model/article");
var mongoose = require("mongoose");

var cache = require("../../utils/redisCache");

router.get('/', 
    function(req, res, next) {
        var domain = getDomain(req);
        var type = req.query.type;
        // set cache name
        res.express_redis_cache_name = domain + '-index-' + type;
        next();
    }, cache.route(),
    function(req, res, next) {
        var domain = getDomain(req);
        let config = require("../../conf/" + getDomain(req));

        var type = req.query.type;
        var queryCond = {
            domain: domain,
        }

        queryCond.videoUrl = { $ne: null };
        queryCond.videoUrl = { $ne: "" };
        
        var briefInfo = "id title articleImgs readCount videoCount updatedAt createdAt hot videoUrl videoTime";
        model.find(queryCond, briefInfo)
        .sort({ hot: 'desc', updatedAt: 'desc', readCount: 'desc', videoCount: 'desc' })
        .limit(30)
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.render('video', { articles: docs, config: config, type: type});
            }
        });
    }
)

router.post('/',

    function(req, res, next) {
        res.set('Content-Type', 'application/json;charset=utf-8');

        var domain = getDomain(req);
        let config = require("../../conf/" + getDomain(req));

        var type = req.query.type;
        var queryCond = {
            domain: domain,
        }

        queryCond.videoUrl = { $ne: null };
        queryCond.videoUrl = { $ne: "" };

        var briefInfo = "id title articleImgs readCount videoCount updatedAt createdAt hot videoUrl videoTime";
        var skp = req.body.from;

        model.find(queryCond, briefInfo)
        .sort({ hot: 'desc', updatedAt: 'desc', readCount: 'desc', videoCount: 'desc' })
        .skip(Number(skp))   
        .limit(20)  
        .exec(function(err, docs) {
            if (err) { 
                console.log(err);
            } else {
                res.json({"resault": 1, "msg": "成功", datas: docs});
            } 
        });
    }
)

function getDomain(req) {
    var host = req.hostname;
    if (host == 'dev.91mitang.com' || host == 'localhost') {
        host = "www.91mitang.com";
    }
    return host;
}

module.exports = router;