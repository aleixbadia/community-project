var express = require("express");
var router = express.Router();
const Design = require("./../models/designs");
const Vote = require("./../models/votes");

const minVotes = 3;
const minRating = 0.5;

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

router.get("/products", async (req, res, next) => {
  const logged = checkLogin(req);
  let rating = 0;
  let votesByDesign = 0;
  let data = [];
  try {
    let designsFound = await Design.find();
    let votesFound = await Vote.find();

    designsFound.forEach((design) => {
      rating = 0;
      votesByDesign = 0;
      votesFound.forEach((vote) => {
        if (String(design._id) === String(vote.designId)) {
          //Calculation of total votes and rating
          votesByDesign++;
          rating += vote.rating;
        }
      });
      if (votesByDesign > minVotes && rating > votesByDesign * minRating) {
        data.push(design);
      }
    });
    res.render("shop/gallery", { logged, data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/products/:designId", function (req, res, next) {
  const logged = checkLogin(req);
  //data missing
  res.render("shop/buy", { logged, data });
});

router.get("/vote", function (req, res, next) {
  const logged = checkLogin(req);
  Design.find()
    .then((data) => {
      data.forEach((design) => {
        design.vote = true;
      });

      res.render("shop/gallery", { logged, data });
    })
    .catch((err) => console.log(err));
});

router.get("/vote/:designId", function (req, res, next) {
  const logged = checkLogin(req);
  Design.findById(req.params.designId)
    .populate("userId")
    .then((data) => {
      res.render("shop/vote", { logged, data });
    })
    .catch((err) => console.log(err));
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
  User.find(req.params.id)
    .then((data) => {
      console.log(data);
      res.render("shop/designer", { logged, data });
    })
    .catch((err) => console.log(err));
  //data missing
});

module.exports = router;
