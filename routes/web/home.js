var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', passport.authenticationMiddleware(), function(req, res, next) {
  res.render('home.handlebars', req.viewbag);
});

/* GET time report page. */
router.get('/timereport', function(req, res, next) {
  req.viewbag.layout = "clean.handlebars";
  res.render('timereport.handlebars', req.viewbag);
});

/* GET login page. */
router.get('/login', function(req, res, next) {

  req.viewbag.layout = "clean.handlebars";
  res.render('login.handlebars', req.viewbag);
});

router.post('/login', passport.authenticate('local', {

  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));

module.exports = router;
