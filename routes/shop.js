var express = require('express');
var router = express.Router();

/* GET shop pages. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/products', function(req, res, next) {
  //data missing
  res.render('shop/gallery'); 
});

router.get('/products/:designId', function(req, res, next) {
  //data missing
  res.render('shop/buy'); 
});

router.get('/vote', function(req, res, next) {
  //data missing
  res.render('shop/gallery'); 
});

router.get('/vote/:designId', function(req, res, next) {
  //data missing
  res.render('shop/vote'); 
});

router.get('/cart', function(req, res, next) {
  //data missing
  res.render('shop/cart'); 
});

router.get('/purchase', function(req, res, next) {
  //data missing
  res.render('shop/purchase'); 
});

router.get('/checkout', function(req, res, next) {
  //data missing
  res.render('shop/checkout'); 
});

router.get('/user/:userId', function(req, res, next) {
  //data missing
  res.render('shop/designer'); 
});

module.exports = router;
