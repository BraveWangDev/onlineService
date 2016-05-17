var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// mongoose初始化
//var mongoose = require('mongoose'),
//    models = require('./models'),         //引入数据库模块(包含全部模型)
//    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/service',
//    db = mongoose.connect(dbUrl, {safe: true});

//var routes = require('./routes/index');
//var users = require('./routes/users');
//var serviceClient = require('./routes/serviceClient');
//var agentClient = require('./routes/agentClient');

var routes = require('./routes');

var app = express();

//app.use(function(req, res, next) {
//  //检查模型存在
//  if (!models.serviceUser) {
//    return next(new Error("No models."));
//  }
//  //原型赋值给请求体request
//  req.models = models;
//  return next();
//});

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

//// routes...
//app.use('/', routes.index);
//app.use('/agentClient', routes.agentClient);
//app.use('/serviceClient', routes.serviceClient);

// Pages and routes
app.get('/', routes.index);
app.get('/agentClient', routes.agentClient.test);
app.get('/serviceClient', routes.serviceClient.test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('err.status = ' + err.status);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
