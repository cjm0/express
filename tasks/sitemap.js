//var mongoose = require("mongoose");

var config = require("../conf/config");
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');


var db = require('mongoose');
db.Promise = global.Promise;
db.connect(config.mongo_db_url, { useMongoClient: true });
global.db = db;
var model = require("../model/article");

function makeSitemap() {
    var briefInfo = "id title domain updatedAt createdAt"
    model.find({}, briefInfo)
        .sort({ domain: 'desc', createdAt: 'desc' })
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            }
            //console.log(docs);
            var domain = "";
            var siteStr = "";
            docs.forEach(element => {
                if (domain && element.domain != domain) {
                    var siteUrlFile = "site-" + domain + "-" + dateFormat(new Date(), 'yyyymmdd') + ".txt";
                    var siteUrlFile = path.join(__dirname, "..", "public", siteUrlFile);
                    writeFile(siteUrlFile, siteStr, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("file wrote. " + siteUrlFile);
                        }
                    });
                    siteStr = "";
                }
                domain = element.domain;
                siteStr += "https://" + element.domain + "/pages/" + element.id + "\n";
            });
            var siteUrlFile = "sites-" + domain + ".txt";
            var siteUrlFile = path.join(__dirname, "..", "public", siteUrlFile);

            fs.writeFile(siteUrlFile, siteStr, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("file wrote. " + siteUrlFile);
                }
            });
            db.connection.close();
        });
}

makeSitemap();