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
    const designsFound = await Design.find();
    const votesFound = await Vote.find();
    let data = [];

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

    res.render("main", { logged, data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/business-model", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    res.render("business-model", { logged });
  } catch (error) {
    console.log(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const products = true;
    let rating = 0;
    let votesByDesign = 0;
    let data = [];
    const logged = await checkLogin(req);
    let designsFound;
    let votesFound = await Vote.find();

    if(req.query.search){
      const designSearch = req.query.search.split(" ");
      const regexStr = designSearch.join("|");
  
      designsFound = await Design.find({ name: { $regex: regexStr, $options: "i"}});
    } else {
      designsFound = await Design.find();
    }

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
    data.reverse();
    res.render("shop/gallery", { logged, data, products });
  } catch (error) {
    console.log(error);
  }
});

router.get("/products/:designId", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const data = await Design.findById(req.params.designId).populate("userId");
    let votesFound = await Vote.find();

    data.votes = 0;
    data.rating = 0;

    votesFound.forEach((vote) => {
      if (String(data._id) === String(vote.designId)) {
        //Calculation of total votes and rating
        data.votes++;
        data.rating += vote.rating;
      }
    });
    res.render("shop/buy", { logged, data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/vote", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    let data;
    if(req.query.search){
      const designSearch = req.query.search.split(" ");
      const regexStr = designSearch.join("|");
  
      data = await Design.find({ name: { $regex: regexStr, $options: "i"}});
    } else {
      data = await Design.find();
    }

    data.forEach((design) => {
      design.vote = true;
    });
    data.reverse();
    res.render("shop/gallery", { logged, data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/vote/:designId", async (req, res, next) => {
  try {
    let availableToVote = true;
    let userId;

    const logged = await checkLogin(req);
    const data = await Design.findById(req.params.designId).populate("userId");
    let votesFound = await Vote.find();

    data.votes = 0;
    data.rating = 0;

    votesFound.forEach((vote) => {
      if (String(data._id) === String(vote.designId)) {
        //Calculation of total votes and rating
        data.votes++;
        data.rating += vote.rating;
      }
    });

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
  } catch (error) {
    console.log(error);
  }
});

router.post("/vote/:designId", async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { designId, rating } = req.body;
    await Vote.create({ userId, designId, rating });
    await User.findByIdAndUpdate(userId, { $inc: { com_points: 10 } });
    res.redirect("/vote");
  } catch (error) {
    console.log(error);
  }
});

router.get("/cart", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const id = logged._id;
    let subtotal = 0;
    let products = 0;

    res.locals.stripePK = process.env.STRIPE_PUBLIC_KEY;

    const user = await User.findById(id).populate("currentCart.designId");

    if (user.currentCart.length !== 0) {
      user.currentCart.forEach((product) => {
        product.productSubtotal =
          Math.round(
            (product.quantity * product.designId.price + Number.EPSILON) * 100
          ) / 100;
        subtotal += product.productSubtotal;
        products += product.quantity;
      });
      user.subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
      user.shipping = shipping * products;
      user.total =
        Math.round((subtotal + user.shipping + Number.EPSILON) * 100) / 100;
      user.display = true;
    } else {
      user.display = false;
    }

    res.render("shop/cart", { logged, user });
  } catch (error) {
    console.log(error);
  }
});

router.post("/cart", async (req, res, next) => {
  try {
    const id = req.session.currentUser._id;
    const { quantity, designId } = req.body;

    await User.findOneAndUpdate(
      { _id: id },
      { $push: { currentCart: { quantity, designId } } }
    );

    res.redirect("/products");
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
});

router.get("/checkout", async (req, res, next) => {
  try {
    const logged = await checkLogin(req);
    const userId = req.session.currentUser._id;
    let subtotal = 0;

    //TAKE CURRENT CART INFO
    const user = await User.findById(userId).populate("currentCart.designId");

    user.currentCart.forEach(async (item) => {
      subtotal +=
        Math.round(
          (item.quantity * item.designId.price + Number.EPSILON) * 100
        ) / 100;

      await User.findByIdAndUpdate(
        item.designId.userId,
        { $inc: { com_points: 100 } },
        { new: true }
      );
    });
    let finalShipping = shipping * user.currentCart.length;
    let total = subtotal + finalShipping;

    //CREATE THE ORDER WITH CART INFO
    await Order.create({
      userId,
      cart: user.currentCart,
      subtotal,
      shipping: finalShipping,
      total,
    });

    //CLEAR USER CURRENT CART
    await User.findByIdAndUpdate(userId, { currentCart: [] }, { new: true });

    //ADD COMPOINTS TO DESIGNER

    res.render("shop/checkout", { logged });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
