//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('agentClient', { title: 'agentClient' });
//});
//
//module.exports = router;



exports.test = function(req, res, next) {
  res.render('agentClient', { title: 'agentClient' });
};
