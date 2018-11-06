var config = require("../conf/config");

var exportCache = {
    route: function(prefix) {
        if (config.enableCache) {
            var cache = require('express-redis-cache')({ expire: config.cacheTimeInSeconds });
            return cache.route(prefix);
        } else {
            return function(req, res, next) {
                next();
            }
        }
    }
}

module.exports = exportCache;