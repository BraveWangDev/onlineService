//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('serviceClient', { title: 'serviceClient' });
//});
//
//module.exports = router;

exports.testServiceClient = function(req, res, next) {
  res.render('serviceClient', { title: 'serviceClient' });
};


// 登陆跳转
exports.login = function(req, res, next) {
  res.render('serviceLogin', { title: 'serviceLogin' });
};

// 登陆验证
exports.loginPost = function(req, res, next) {
  if (!req.body.username || !req.body.password){
    return res.render('serviceLogin', {error: '请输入用户名和密码'});
  }else {
    console.log('req.body.username = ' + req.body.username);
    console.log('req.body.password = ' + req.body.password);
    //查询用户
    req.models.serviceModel.find({username: req.body.username}, function(error, user){
      if (error) return next(error);
      if (user  && user.length > 0) {
        console.log('用户名存在');
        console.log(user);
        var password = user[0].password;
        console.log("打印输入密码 = " + req.body.password);
        console.log("打印账号密码 = " + password);
        if(password != req.body.password){
          return res.render('serviceLogin', {error: '密码错误'});
        }else{
          //验证通过-赋值跳转
          //req.session.user = user;
          //判断是否是管理员
          //req.session.admin = user.admin;
          console.log('loginPost->serviceClient');
          res.redirect('/serviceClient');
        }
      }else{
        console.log('用户不存在');
        return res.render('serviceLogin', {error: '用户名不存在'});
      }
    })
  }
};

//注册跳转
exports.register = function(req, res, next) {
  res.render('serviceRegister', { title: 'serviceRegister' });
};

//注册提交处理
exports.registerPost = function(req, res, next) {

  if (!req.body.username || !req.body.password){
    return res.render('serviceRegister', {error: '请输入用户名和密码'});
  }else{
    console.log('req.body.username = ' + req.body.username);
    console.log('req.body.password = ' + req.body.password);

    //查看账号是否存在
    req.models.serviceModel.find({username: req.body.username}, function(error, user){
      if (error) return next(error);
      if (user && user.length > 0) { //用户存在
        console.log(user);
        return res.render('serviceRegister', {error: '用户名存在'});
      }else{
        console.log(user);
        console.log('用户不存在-创建用户');

        var serviceRegisterInfo = {
          username: req.body.username,
          password: req.body.password,
          channel: 1,
        };

        //创建客服账号
        req.models.serviceModel.create(serviceRegisterInfo , function(error, user){
          if (error) return next(error);
          if (!user) return res.render('serviceRegister', {error: 'Incorrect email&password combination.'});
          console.log('创建客服成功 username = ' + serviceRegisterInfo.username + ", password = " + serviceRegisterInfo.password);
          res.redirect('/serviceLogin');
        })
      }
    })
  }
};


