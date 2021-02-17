var express = require("express");
var router = express.Router();
const Design = require("./../models/designs");
const Vote = require("./../models/votes");
const User = require("./../models/users");
const Order = require("./../models/orders");


const minVotes = 3;
const minRating = 0.5;

function checkLogin(req) {
  if (req.session.currentUser) {
    // if user has an authenticated cookie
    User.find
    return req.session.currentUser;
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
    let availableToVote = true;
    const logged = checkLogin(req);
    let userId;

    const data = await Design.findById(req.params.designId).populate(
      "userId"
    );

    if (logged) {
      userId = req.session.currentUser._id;
      const alreadyVoted = await Vote.find({
        $and: [{ userId: userId }, { designId: data._id }],
      });

      if (
        String(userId) === String(data.userId._id) ||
        alreadyVoted.length !== 0
      ) {
        availableToVote = false;
      }
    } else {
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
    await Vote.create({ userId, designId, rating });
    await User.findByIdAndUpdate(userId, { $inc: { com_points : 10 }});
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
  //Stripe implementation
  
  res.redirect("/checkout");
});

router.get("/checkout", async (req, res, next) => {
  const logged = checkLogin(req);
  const userId = req.session.currentUser._id;
  
  //TAKE CURRENT CART INFO
  const user = await User.findById(userId)
  const cart = user.currentCart  

  //CREATE THE ORDER WITH CART INFO 
  await Order.create( { userId, cart })
  
  //CLEAR USER CURRENT CART
  await User.findByIdAndUpdate(userId, { currentCart: [] }, {new: true})

  //ADD COMPOINTS TO DESIGNER

  
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
