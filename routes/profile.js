var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('profile/user');
});

router.get('/edit', function(req, res, next) {
  res.render('profile/editDetails');
});

router.get('/orders', function(req, res, next) {
  res.render('profile/orders');
});

router.get('/upload', function(req, res, next) {
  res.render('profile/upload');
});



module.exports = router;