var express = require('express');
var router = express.Router();

var model = require("../../model/article");
var mongoose = require("mongoose");

//var path = require('path');
//var fs = require("fs");


/* GET All article. */
router.get('/', function(req, res, next) {
    var domain = getDomain(req);

    model.find({
        domain: domain
    }, function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            sendJson(docs, res);
        }
    });
});

/* GET All article. */
router.get('/brief_info', function(req, res, next) {
    var domain = getDomain(req);
    var briefInfo = "id title articleImgs readCount updatedAt createdAt hot videoUrl"
    var queryCond = {
        domain: domain
    };

    model
    .find(queryCond, briefInfo)
    .limit(200)
    .sort({ updatedAt: 'desc' })
    .exec(function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            sendJson(docs, res);
        }
    });
});

/* GET One article. */
router.get('/:articleId', function(req, res, next) {
    var domain = getDomain(req);
    model.find({
            id: req.params.articleId,
            domain: domain
        },
        function(err, docs) {
            if (err) {
                console.log(err)
            } else {
                sendJson(docs, res);
            }
        });
});

/* Create a new article. */
router.post('/', function(req, res, next) {
    var domain = getDomain(req);
    var article = req.body;
    article.domain = domain;

    console.log(article)
    //var configFilePath = path.join(__dirname, "..", "..", "conf", domain + ".json")
    model.find({
            id: article.id,
            domain: domain
        },
        function(err, docs) {
            if (err) {
                console.log(err)
            } else {
                if (docs && docs.length > 0) {
                    sendErrorRes("Article " + article.id + " is already Exist.", res);
                } else {
                    if (article.hot > 0) {
                        //updateIndexImage(article, configFilePath, domain);
                    }
                    model.create(article, function(err, doc) {
                        if (err) {
                            console.log(err)
                        } else {
                            sendJson(doc, res);
                        }
                    });
                }
            }
        });
});

/* modify an article. */
router.put('/:articleId', function(req, res, next) {
    var domain = getDomain(req);

    //var configFilePath = path.join(__dirname, "..", "..", "conf", domain + ".json")

    var conditions = { id: req.params.articleId, domain: domain };
    var updateArticle = req.body;
    delete updateArticle.id;
    delete updateArticle.domain;
    var options = { multi: true };

    model.update(conditions, updateArticle, options, function(err, numAffected) {
        res.send("update success. affected:" + numAffected.nModified);
        //updateIndexImage(updateArticle, configFilePath, domain);
    });
});

/* Delete an article. */
router.delete('/:articleId', function(req, res, next) {
    var domain = getDomain(req);
    var conditions = { id: req.params.articleId, domain: domain };

    model.remove(conditions, function(err, numAffected) {
        console.log(numAffected);
        console.log(numAffected.result);
        res.send("Delete success. affected:" + numAffected);
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

function sendErrorRes(rs, res) {
    res
        .type("json")
        .status(200)
        .json({ err_info: rs });
}

/*function updateIndexImage(article, configFilePath, domain) {
    if (!article.articleImgs || !article.articleImgs[0]) {
        return;
    }
    var config = require(configFilePath);
    for (var type of config.types) {
        if (type.value == article.type) {
            for (var subType of type.subTypes) {
                if (subType.value == article.subType) {
                    subType.img = article.articleImgs[0];
                    console.log("found");
                }
            }
        }
    }
    var radomFileName = "config-" + Math.floor(Math.random() * 100000) + ".tmp.json";
    fs.writeFile(radomFileName, JSON.stringify(config, null, '    '), "utf8", function(err) {
        if (err) {
            console.log(err);
        } else {
            fs.rename(radomFileName, configFilePath, function(err) {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
}*/

module.exports = router;