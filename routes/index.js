//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  //res.render('index', { title: 'Express-io' });
//  res.render('index', { title: 'Express-io' });
//  //res.sendfile('views/testConnect.html');
//});
//
//module.exports = router;


exports.serviceClient = require('./serviceClient');
exports.agentClient = require('./agentClient');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  res.render('index', { title: 'Express-io' });
};
