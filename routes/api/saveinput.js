var express = require('express');
var router = express.Router();

var model = require("../../model/Input");
var mongoose = require("mongoose");

//var path = require('path');
//var fs = require("fs");


/* GET All article. */
router.get('/', function(req, res, next) {
    var domain = getDomain(req);

    model.find({}, function(err, docs) {
        if (err) {
            sendErrorRes(err, res);
        } else {
            sendJson(docs, res);
        }
    });
});


/* Create a new article. */
router.post('/', function(req, res, next) {
    var article = req.body;

    console.log(article)

    model.find({
            name: article.name
        },
        function(err, docs) {
            if (err) {
                console.log(err)
            } else {
                if (docs && docs.length > 0) {
                    sendErrorRes(article.name + "是重复的", res);
                } else {
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
router.delete('/:name', function(req, res, next) {
    var conditions = { name: req.params.name};

    model.remove(conditions, function(err, numAffected) {
        console.log(numAffected);
        console.log(numAffected.result);
        res.send("Delete success. affected:" + numAffected);
    });
});

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

module.exports = router;

