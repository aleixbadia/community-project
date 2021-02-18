require("dotenv").config();
const express = require("express");
const router = express.Router();

const Design = require("./../models/designs");
const Vote = require("./../models/votes");
const User = require("./../models/users");
const Order = require("./../models/orders");

const minVotes = 3;
const minRating = 0.5;
const shipping = 3;

const checkLogin = async (req) => {
  try {
    if (req.session.currentUser) {
      const user = await User.findById(req.session.currentUser._id);
      return user;
    } else {
      return false;
    }
  } catch (error) {}
};

/* GET shop pages. */
router.get("/", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    res.render("main", { logged });
  } catch (error) {
    console.log(err);
  }
});

router.get("/business-model", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    res.render("business-model", { logged });
  } catch (error) {
    console.log(err);
  }
});

router.get("/products", async (req, res, next) => {
  let rating = 0;
  let votesByDesign = 0;
  let data = [];
  try {
    const logged = await checkLogin(req);
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

router.get("/products/:designId", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const data = await Design.findById(req.params.designId).populate("userId");
    res.render("shop/buy", { logged, data });
  } catch (error) {
    console.log(err);
  }
});

router.get("/vote", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const data = await Design.find();
    data.forEach((design) => {
      design.vote = true;
    });
    res.render("shop/gallery", { logged, data });
  } catch (error) {
    console.log(err);
  }
});

router.get("/vote/:designId", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    let availableToVote = true;
    let userId;

    const data = await Design.findById(req.params.designId).populate("userId");

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
    await User.findByIdAndUpdate(userId, { $inc: { com_points: 10 } });
    res.redirect("/vote");
  } catch (err) {
    console.log(err);
  }
});

router.get("/cart", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const id = logged._id;
    let total = 0;

    res.locals.stripePK = process.env.STRIPE_PUBLIC_KEY;

    const user = await User.findById(id).populate("currentCart.designId");

    user.currentCart.forEach((product) => {
      product.subtotal = product.quantity * product.designId.price;
      total += product.subtotal;
    });
    user.currentCartV = total;
    user.shipping = shipping;
    user.finalCost = total + shipping;
    res.render("shop/cart", { logged, user });

    const data = await Design.findById(req.params.designId).populate("userId");
    res.render("shop/buy", { logged, data });
  } catch (error) {
    console.log(err);
  }
});

router.post("/cart", async (req, res, next) => {
  try {
    const id = req.session.currentUser._id;
    const { quantity, designId } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id },
      { $push: { currentCart: { quantity, designId } } }
    );

    res.redirect("/products");
  } catch (error) {
    console.log(err);
  }
});

router.post("/cart/delete", async (req, res, next) => {
  try {
    const id = req.session.currentUser._id;
    const { designId } = req.body;

    await User.findOneAndUpdate(
      { _id: id },
      { $pull: { currentCart: { designId: designId } } }
    );

    res.redirect("/cart");
  } catch (error) {
    console.log(err);
  }
});

router.get("/checkout", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const userId = req.session.currentUser._id;
  
    //TAKE CURRENT CART INFO
    const user = await User.findById(userId).populate("currentCart.designId");
    const cart = user.currentCart;
    cart.forEach(async (item) => {
      const updatedPoints = await User.findByIdAndUpdate(
        item.designId.userId,
        { $inc: { com_points: 100 } },
        { new: true }
      );
      console.log(updatedPoints);
    });
    //CREATE THE ORDER WITH CART INFO
    await Order.create({ userId, cart });
  
    //CLEAR USER CURRENT CART
    await User.findByIdAndUpdate(userId, { currentCart: [] }, { new: true });
  
    //ADD COMPOINTS TO DESIGNER
  
    res.render("shop/checkout", { logged });
  } catch (error) {
    console.log(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
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
