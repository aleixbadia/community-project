var express = require("express");
var router = express.Router();

function checkLogin(req) {
  if (req.session.currentUser) {
    // if user has an authenticated cookie
    return true;
  } else {
    return false;
  }
}

/* GET shop pages. */
router.get("/", function (req, res, next) {
  const logged = checkLogin(req);
  res.render("main", { logged });
});

router.get("/products", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/gallery", { logged });
});

router.get("/products/:designId", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/buy", { logged });
});

router.get("/vote", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/gallery", { logged });
});

router.get("/vote/:designId", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/vote", { logged });
});

router.get("/cart", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/cart", { logged });
});

router.get("/purchase", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/purchase", { logged });
});

router.get("/checkout", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/checkout", { logged });
});

router.get("/user/:userId", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/designer", { logged });
});

module.exports = router;
