var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//20160518 add mongoose初始化
var mongoose = require('mongoose'),
    models = require('./models'),         //引入数据库模块(包含全部模型)
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/service',
    db = mongoose.connect(dbUrl, {safe: true});

//20160517 modify routes
//var routes = require('./routes/index');
//var users = require('./routes/users');
//var serviceClient = require('./routes/serviceClient');
//var agentClient = require('./routes/agentClient');
var routes = require('./routes');
var app = express();

//20160518 add mongose添加后检验models完整性中间件
app.use(function(req, res, next) {
  //检查模型存在
  if (!models.serviceModel) {
    return next(new Error("No models."));
  }
  //原型赋值给请求体request对象
  req.models = models;
  return next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** ******************* Pages and routes ******************* **/

//20160517 modify routes
//// routes...
//app.use('/', routes.index);
//app.use('/agentClient', routes.agentClient);
//app.use('/serviceClient', routes.serviceClient);

// Pages and routes
app.get('/', routes.index);                                         // 首页
app.get('/serviceRegister', routes.serviceClient.register);                // 注册页面跳转
app.post('/serviceRegister', routes.serviceClient.registerPost);           // 提交注册信息
app.get('/serviceLogin', routes.serviceClient.login);               // 登陆页面跳转
app.post('/serviceLogin', routes.serviceClient.loginPost);          // 提交登陆信息
app.get('/serviceClient', routes.serviceClient.testServiceClient);  // 客服端页面跳转
app.get('/agentClient', routes.agentClient.testAgentClient);        // 用户端页面跳转

/** ******************* error handlers ******************* **/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 1)development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 2)production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('err.status = ' + err.status);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
