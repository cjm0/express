var config = require("../conf/config");
var dateFormat = require('dateformat');
var moment = require("moment");
var fs = require('fs');
var path = require('path');

var db = require('mongoose');
db.Promise = global.Promise;
db.connect(config.mongo_db_url, { useMongoClient: true });
global.db = db;
var model = require("../model/article");


//TODO 未实现
function exportSeoXml() {
    console.log("export to XML ......");
    var siteDigestFileName = "site-digest-" + host + "-" + dateFormat(new Date(), 'yyyymmdd') + ".xml";
    var siteDigestFile = path.join(__dirname, "..", "public", siteDigestFileName);

};

function generateXml(jsonArr) {
    var articleConfFile = path.join(__dirname, "..", "config", "articles.txt");
    var toExportIds;
    if (fs.existsSync(articleConfFile)) {
        toExportIds = fs.readFileSync(articleConfFile);
    }

    var toExportIdArr = new String(toExportIds).split('\n');

    xw = new XMLWriter(true);
    xw.startDocument(1.0, "utf-8");
    xw.startElement('DOCUMENT');
    var root = xw.writeAttribute('content_method', 'full');

    for (let i = 0; i < jsonArr.length; i++) {
        var page = JSON.parse(jsonArr[i].seo_content);
        if (!page || !page.seo || page.seo.length == 0) {
            continue;
        }
        if (page.type != "问答" || page.seo[0].title.indexOf("视频") > -1) {
            continue;
        }
        if (!toExportIdArr || toExportIdArr.indexOf(page.pageId) == -1) {
            continue;
        }
        var keysArr = page.seo;
        for (let j = 0; j < keysArr.length; j++) {
            if (!keysArr[j].key || keysArr[j].key.length < 3) {
                continue;
            }
            root.startElement("item");
            root.startElement("key").text(keysArr[j].key);
            root.endElement();

            root.startElement("display");

            root.startElement("url").text(keysArr[j].url);
            root.endElement();

            root.startElement("title").text(keysArr[j].title);
            root.endElement();

            root.startElement("img").text(keysArr[j].img);
            root.endElement();

            root.startElement("row");

            root.startElement("content").text(keysArr[j].content);
            root.endElement();

            root.endElement();

            root.startElement("info");

            root.startElement("author");
            root.startElement("img").text("https://ks3-cn-beijing.ksyun.com/ibuy-baidu-img/game/logo.png");
            root.endElement();
            root.startElement("name").text("游戏风暴");
            root.endElement();
            //end for author
            root.endElement();

            root.startElement("content").text("游戏高手在这里");
            root.endElement();

            //end for info
            root.endElement();

            root.startElement("showurl").text("106.51fashionlife.com");
            root.endElement();

            root.startElement("productUrl").text("http://106.51fashionlife.com/index.html");
            root.endElement();

            root.endElement();

            root.endElement();
        }
    }
    root.endElement();
    xw.endDocument();
    return xw.toString();
}

exportSeoXml();