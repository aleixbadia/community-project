var express = require("express");
var router = express.Router();
const User = require("./../models/users");
const Design = require("./../models/designs");
const Order = require("./../models/orders");
const { isLoggedIn } = require("./../utils/middleware");

const fileUploader = require("../configs/cloudinary.config");

/* GET users listing. */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const profile = true;
    const id = req.session.currentUser._id;
    let user = await User.findById(id);
    let designs = await Design.find({ userId: id });
    res.render("profile/user", { logged, profile, user, designs });
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const profile = true;

    const user = await User.findById(req.session.currentUser._id);
    res.render("profile/editDetails", { logged, profile, user });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/edit",
  isLoggedIn,
  fileUploader.single("image"),
  async (req, res, next) => {
    try {
      const id = req.session.currentUser._id;

      const {
        firstName,
        lastName,
        age,
        gender,
        street,
        city,
        postcode,
        state,
        country,
      } = req.body;

      const picture = req.file.path;

      await User.findByIdAndUpdate(
        id,
        {
          "name.firstName": firstName,
          "name.lastName": lastName,
          age,
          picture,
          gender,
          "addres.street": street,
          "addres.city": city,
          "addres.postcode": postcode,
          "addres.state": state,
          "addres.country": country,
        },
        { new: true }
      );
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/orders", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const profile = true;
    const userId = req.session.currentUser._id;
    const orders = await Order.find({ userId }).populate("cart.designId");
    orders.reverse();
    res.render("profile/orders", { logged, profile, orders, userId });
  } catch (error) {
    console.log(error);
  }
});

router.get("/upload", isLoggedIn, (req, res, next) => {
  const logged = true;
  const profile = true;
  res.render("profile/upload", { logged, profile });
});

router.post(
  "/upload",
  isLoggedIn,
  fileUploader.single("image"),
  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const userId = req.session.currentUser._id;
  
      await Design.create({ userId, name, description, url: req.file.path })
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/edit/:designId", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const id = req.params.designId;
    const design = await Design.findById(id);
    res.render("profile/editDesign", { logged, design });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit/:designId", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.designId;
    const { name, description, url } = req.body;
    await Design.findByIdAndUpdate(
      id,
      { name, description, url },
      { new: true }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit/:designId/delete", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.designId;
    await Design.findById(id);
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
