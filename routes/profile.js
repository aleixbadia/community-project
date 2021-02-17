var express = require("express");
var router = express.Router();
const User = require("./../models/users");
const Design = require("./../models/designs");
const Order = require("./../models/orders");
const { isLoggedIn } = require("./../utils/middleware");

const fileUploader = require('../configs/cloudinary.config');

/* GET users listing. */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const profile = true;
    const id = req.session.currentUser._id;
    let user = await User.findById(id)
    let designs = await Design.find({userId: id})
    res.render("profile/user", { logged, profile, user, designs });
  } catch (error) {
    console.log(err)
  }
});

router.get("/edit", isLoggedIn, function (req, res, next) {
  const logged = true;
  const profile = true;
  const id = req.session.currentUser._id;
  User.findById(id)
    .then((user) => {
      res.render("profile/editDetails", { logged, profile, user });
    })
    .catch((err) => console.log(err));
});

router.post("/edit", isLoggedIn, function (req, res, next) {
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
    picture,
  } = req.body;

  User.findByIdAndUpdate(
    id,
    { "name.firstName": firstName, "name.lastName": lastName, age: age },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      const logged = true;
      const { name, picture } = updatedUser;
      res.redirect("/profile");
    })
    .catch((err) => console.log(err));
});

router.get("/orders", isLoggedIn, async (req, res, next) => {
  const logged = true;
  const profile = true;
  const userId = req.session.currentUser._id;
  const orders = await Order.find( { userId }).populate("cart.designId")
  res.render("profile/orders", { logged, profile, orders, userId });
});

router.get("/upload", isLoggedIn, function (req, res, next) {
  const logged = true;
  const profile = true;
  res.render("profile/upload", { logged, profile });
});

router.post("/upload", isLoggedIn, fileUploader.single('image'), (req, res, next) => {
  const { name, description,} = req.body
  const url = req.file.path
  const userId = req.session.currentUser._id

  console.log("name", name, "description", description)
  console.log("url", url)

  Design.create({ userId, name, description, url: req.file.path })
  .then( (data) => {
    res.redirect("/profile");
  })
  .catch( (err) => console.log(err));
});

router.get("/edit/:designId", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const id = req.params.designId;
    const design = await Design.findById(id)
    res.render("profile/editDesign", { logged, design });
  } catch (err) {
    console.log(err)
  };
});

router.post("/edit/:designId", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.designId
    const {name, description, url} = req.body
    const design = await Design.findByIdAndUpdate(id, {name, description, url}, {new: true})
    res.redirect("/profile");
  } catch (error) {
    console.log(err)    
  };
});

router.post("/edit/:designId/delete", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.designId
    console.log(id)
    const design = await Design.findById(id)
    console.log()
    res.redirect("/profile");
  } catch (error) {
    console.log(err)    
  };
});
module.exports = router;
