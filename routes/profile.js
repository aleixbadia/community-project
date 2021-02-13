var express = require('express');
var router = express.Router();
const {isLoggedIn} = require('./../utils/middleware')

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('profile/user');
});

router.get('/edit', isLoggedIn, function(req, res, next) {
  res.render('profile/editDetails');
});

router.get('/orders', isLoggedIn, function(req, res, next) {
  res.render('profile/orders');
});

router.get('/upload', isLoggedIn, function(req, res, next) {
  res.render('profile/upload');
});



module.exports = router;