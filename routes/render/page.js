var express = require('express');
var router = express.Router();


var model = require("../../model/article");
var mongoose = require("mongoose");

var cache = require("../../utils/redisCache");

router.get('/:id',
    function(req, res, next) {
        var domain = getDomain(req);
        var ID = req.params.id;
        model.update({ domain: domain, id: ID }, { $inc: { readCount: 1, videoCount: 1 } }, (err) => {
            if (err) {
                console.log(err)
            }
        });
        next();
    },
    function(req, res, next) {
        var domain = getDomain(req);
        var ID = req.params.id;
        // set cache name
        res.express_redis_cache_name = domain + '-id-' + ID;
        next();
    }, cache.route(),
    function(req, res, next) {
        var domain = getDomain(req);
        var ID = req.params.id;

        model.findOne({ domain: domain, id: ID }, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                doc.created = time(doc.createdAt);
                doc.updated = time1(doc.updatedAt);
                doc.videoTime1 = time2(doc.videoTime);
                doc.desc = doc.seoSteps.desc || doc.seoQA[0].desc1;
                doc.answer0 = doc.answer || doc.desc;

                if (doc.aboutID.length > 0) {
                    model.find({ domain: domain, id: { $in: doc.aboutID } }, 'id title videoUrl videoImg videoCount articleImgs readCount videoTime', (err, doc2) => {
                        if (err) {
                            console.log(err)
                        } else {
                            doc.about = doc2;
                            res.render('page', doc)
                        }
                    })
                } else {
                    model.find({ domain: domain, id: { $in: [doc.aboutID1, doc.aboutID2, doc.aboutID3, doc.aboutID4, doc.aboutID5] } }, 'id title videoUrl videoImg videoCount articleImgs readCount videoTime', (err, doc2) => {
                        if (err) {
                            console.log(err)
                        } else {
                            doc.about = doc2;
                            res.render('page', doc)
                        }
                    })
                };
            };
        });
    });

function time(obj) {
    if (!obj) return '';

    function zero(str) {
        return (str > 9 ? str : '0' + str)
    }
    let time = new Date(obj);
    let str1 = time.getFullYear() + '-' + zero(time.getMonth() + 1) + '-' + zero(time.getDate());
    let str2 = zero(time.getHours()) + ':' + zero(time.getMinutes()) + ':' + zero(time.getSeconds());
    return str1 + 'T' + str2
}

function time1(obj) {
    if (!obj) return;

    function zero(str) {
        return (str > 9 ? str : '0' + str)
    }
    let time = new Date(obj);
    let str1 = time.getFullYear() + '-' + zero(time.getMonth() + 1) + '-' + zero(time.getDate());
    return str1
}

function time2(obj) {
    if (!obj) return;
    return Number(obj.split(':')[0] * 60) + Number(obj.split(':')[1])
}

function getDomain(req) {
    var host = req.hostname;
    if (host == 'dev.91mitang.com' || host == 'localhost') {
        host = "www.91mitang.com";
    }
    return host;
};

module.exports = router;