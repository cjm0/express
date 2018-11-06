// 每天凌晨运行一次，生成前一天的sitemap.url，并推送到百度
//curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?appid=1584572240597634&token=tfOKvyMiXuYQMmuv&type=realtime"

//var mongoose = require("mongoose");

var config = require("../conf/config");
var dateFormat = require('dateformat');
var moment = require("moment");
var fs = require('fs');
var path = require('path');

var exec = require('child_process').exec;
var cmd = 'curl -H \'Content - Type: text / plain \' --data-binary @${file_name} "http://data.zz.baidu.com/urls?appid=' + config.appid + '&token=' + config.token + '&type=realtime"';

var db = require('mongoose');
db.Promise = global.Promise;
db.connect(config.mongo_db_url, { useMongoClient: true });
global.db = db;
var model = require("../model/article");


function makeSitemap() {
    var briefInfo = "id title domain updatedAt createdAt";
    var yesterdayBegin = moment(moment().subtract(1, 'days').format().substring(0, 10) + "T00:00:00+08:00").format();
    var todayBegin = moment(moment().format().substring(0, 10) + "T00:00:00+08:00").format();

    var queryCond = {
        createdAt: {
            $gte: yesterdayBegin,
            $lt: todayBegin
        }
    }
    model.find(queryCond, briefInfo)
        .sort({ domain: 'desc', createdAt: 'desc' })
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            }
            console.log(docs);
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
                        cmd = cmd.replace('${file_name}', siteUrlFile);
                        execCmd(cmd);
                    });

                    siteStr = "";
                }
                domain = element.domain;
                siteStr += "https://" + element.domain + "/pages/" + element.id + "\n";
            });
            if (siteStr) {
                var siteUrlFile = "site-" + domain + "-" + dateFormat(new Date(), 'yyyymmdd') + ".txt";
                var siteUrlFile = path.join(__dirname, "..", "public", siteUrlFile);

                fs.writeFile(siteUrlFile, siteStr, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("file wrote. " + siteUrlFile);
                    }
                    cmd = cmd.replace('${file_name}', siteUrlFile);
                    execCmd(cmd);
                });
            }
            db.connection.close();
        });

    console.log(queryCond);
}

function execCmd(cmdStr) {
    exec(cmdStr, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        if (stderr) {
            console.log(stderr);
        }
        console.log(stdout);
    });
}

makeSitemap();