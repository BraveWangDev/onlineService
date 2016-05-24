
exports.commonList = function(req, res, next) {
  res.render('commonList', { title: 'commonList' });
};

/**
 * 添加常用语
 */
exports.add = function(req, res, next) {
    console.log("进入 PostCommon");
    if (!req.body){
        return res.send({resCode: 100, message: '缺少参数:添加常用语信息'});
    }else{
        console.log('req.body.username = ' + req.body.username);
        console.log('req.body.content = ' + req.body.content);
        //创建客服账号
        req.models.commonModel.create(req.body, function(error, commonInfo){
            if (error) return next(error);
            console.log('创建客服成功 username = ' + commonInfo.username + ", content = " + commonInfo.content);
            res.send({resCode: 200, resData: commonInfo, message:'success'});
        })
    }
};

/**
 * 查找常用语
 */
exports.find = function(req, res, next) {
    console.log("进入 findCommon");
    console.log("req.params.username = " + req.params.username);
    if(!req.params.username){
        return res.send({resCode: 100, message: '缺少参数:查找常用语接口-用户名'});
    }
    req.models.commonModel.find({username: req.params.username}, function(error, commonList){
        if (error) return next(error);
            console.log("commonList.length = " + commonList.length);
        if (commonList && commonList.length > 0) {
            res.send({resCode: 200, resData: commonList, message:'success'});
        }else{

        }
    })
}

//// 登陆跳转
//exports.login = function(req, res, next) {
//  res.render('serviceLogin', { title: 'serviceLogin' });
//};
//
//// 登陆验证
//exports.loginPost = function(req, res, next) {
//  if (!req.body.username || !req.body.password){
//    return res.render('serviceLogin', {error: '请输入用户名和密码'});
//  }else {
//    console.log('req.body.username = ' + req.body.username);
//    console.log('req.body.password = ' + req.body.password);
//    //查询用户
//    req.models.serviceModel.find({username: req.body.username}, function(error, user){
//      if (error) return next(error);
//      if (user  && user.length > 0) {
//        console.log('用户名存在');
//        console.log(user);
//        var password = user[0].password;
//        console.log("打印输入密码 = " + req.body.password);
//        console.log("打印账号密码 = " + password);
//        if(password != req.body.password){
//          return res.render('serviceLogin', {error: '密码错误'});
//        }else{
//          //验证通过-赋值跳转
//          //req.session.user = user;
//          //判断是否是管理员
//          //req.session.admin = user.admin;
//          console.log('loginPost->serviceClient');
//          res.redirect('/serviceClient');
//        }
//      }else{
//        console.log('用户不存在');
//        return res.render('serviceLogin', {error: '用户名不存在'});
//      }
//    })
//  }
//};
//
////注册跳转
//exports.register = function(req, res, next) {
//  res.render('serviceRegister', { title: 'serviceRegister' });
//};
//



