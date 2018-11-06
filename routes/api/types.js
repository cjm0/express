var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    var config = require("../../conf/"+getDomain(req));
    res.send(config);
});

function getDomain(req) {
    var host = req.hostname;
    if (host == 'dev.91mitang.com' || host == 'localhost') {
        host = "www.91mitang.com";
    }
    return host;
}

module.exports = router;
