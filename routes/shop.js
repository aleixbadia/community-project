var express = require("express");
var router = express.Router();
const Design = require("./../models/designs");
const Vote = require("./../models/votes");
const User = require("./../models/users");

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

router.get("/business-model", function (req, res, next) {
  res.render("business-model");
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
  Design.findById(req.params.designId)
    .populate("userId")
    .then((data) => {
      res.render("shop/buy", { logged, data });
    })
    .catch((err) => console.log(err));
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

router.get("/vote/:designId", async (req, res, next) => {
  try {
    const logged = checkLogin(req);
    let availableToVote = true;

    const data = await Design.findById(req.params.designId).populate("userId");

    const userId = req.session.currentUser._id;

    const designId = data._id;
    const designerId = data.userId._id;

    const alreadyVoted = await Vote.find({
      $and: [{ userId: userId }, { designId: designId }],
    });

    if (String(userId) === String(designerId)) {
      availableToVote = false;
    } else if (alreadyVoted.length !== 0) {
      availableToVote = false;
    }
    res.render("shop/vote", { logged, availableToVote, data });
  } catch (err) {
    console.log(err);
  }
});

router.post("/vote/:designId", async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { designId, rating } = req.body;
    const createdVote = await Vote.create({ userId, designId, rating });
    res.redirect("/vote");
  } catch (err) {
    console.log(err);
  }
});

router.get("/cart", function (req, res, next) {
  const logged = checkLogin(req);
  const id = req.session.currentUser._id;
  let total = 0;
  const shipping = 3;

  User.findById(id)
    .populate("currentCart.designId")
    .then((user) => {
      user.currentCart.forEach((product) => {
        product.subtotal = product.quantity * product.designId.price;
        total += product.subtotal;
      });
      user.currentCartV = total;
      user.shipping = shipping;
      user.finalCost = total + shipping;
      res.render("shop/cart", { logged, user });
    })
    .catch((err) => console.log(err));
});

router.post("/cart", function (req, res, next) {
  const id = req.session.currentUser._id;

  const { quantity, designId } = req.body;

  User.findOneAndUpdate(
    { _id: id },
    { $push: { currentCart: { quantity, designId } } }
  )
    .then((user) => {
      console.log(user.currentCart);

      res.redirect("/products");
    })
    .catch((err) => console.log(err));
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

router.get("/user/:userId", async (req, res, next) => {
  try {
    const logged = checkLogin(req);
    const userData = await User.findById(req.params.userId);
    const userDesigns = await Design.find({ userId: req.params.userId });
    const votes = await Vote.find();
    let designsToBuy = [];
    let designsToVote = [];
    let rating = 0;
    let votesByDesign = 0;

    userDesigns.forEach((design) => {
      rating = 0;
      votesByDesign = 0;
      votes.forEach((vote) => {
        if (String(design._id) === String(vote.designId)) {
          //Calculation of total votes and rating
          votesByDesign++;
          rating += vote.rating;
        }
      });
      if (votesByDesign > minVotes && rating > votesByDesign * minRating) {
        designsToBuy.push(design);
      } else {
        designsToVote.push(design);
      }
    });
    res.render("shop/designer", {
      logged,
      userData,
      designsToBuy,
      designsToVote,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
