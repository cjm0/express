var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);


var config = require("./conf/config");
var db = require('mongoose');
db.Promise = global.Promise;
db.connect(config.mongo_db_url, { useMongoClient: true });
db.connection.once('open', () => {
    console.log("数据库成功连接")
})
global.db = db;



// 渲染页面 render
var index = require('./routes/render/index');
var video = require('./routes/render/video');
var result = require('./routes/render/result');
var page = require('./routes/render/page');



// 操作数据库 api
var users = require('./routes/api/users');
var types = require('./routes/api/types');
var articles = require('./routes/api/articles');
var about_link = require('./routes/api/about_link');
var upload = require('./routes/api/upload');



// 后台管理 admin
var login = require('./routes/admin/login');
var register = require('./routes/admin/register');


// 其他
var siteIndex = require('./routes/site-index');


 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('admin'));
app.use(session({
    secret:'admin',// 用来对session id相关的cookie进行签名
    saveUninitialized:false,// 是否自动保存未初始化的会话，建议false
    resave:false,// 是否每次都重新保存会话，建议false
    store: new redisStore(),
    name:'sid',//cookie的name，默认值是：connect.sid
    cookie:{
        maxAge: 1000 * 60 *60
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// 去掉自动传给前端的 express 字符
app.disable('x-powered-by');



//设置跨域访问
app.all('*', function(req, res, next) {
    // 允许全局跨域
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // 允许上传的头标志
    res.header("Access-Control-Allow-Headers", "X-Requested-With, cjm, content-type");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Content-Type", "text/html;charset=utf-8");
    // 跨域请求带cookies
    res.header("Access-Control-Allow-Credentials",true); 

    if (req.method == 'OPTIONS') {
        res.status(200).send('options is ok');
    } else {
        next();
    }
});






// 渲染页面 render
app.use('/', index);
app.use('/video', video);
app.use('/result', result);
app.use('/pages', page);



// 操作数据库 api
app.use('/users', users);
app.use('/types', types);
app.use('/articles', articles);
app.use('/about_link', about_link);
app.use('/upload', upload);



// 后台管理 admin
app.use('/login', login);
app.use('/register', register);


// 其他
app.use('/siteindex', siteIndex);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;