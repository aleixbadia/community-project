var express = require("express");
var router = express.Router();
const User = require("./../models/users");
const Design = require("./../models/designs");
const { isLoggedIn } = require("./../utils/middleware");

/* GET users listing. */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const logged = true;
    const id = req.session.currentUser._id;
    let user = await User.findById(id)
    let designs = await Design.find({userId: id})
    res.render("profile/user", { logged, user, designs });
  } catch (error) {
    console.log(err)
  }
});

router.get("/edit", isLoggedIn, function (req, res, next) {
  const logged = true;
  const id = req.session.currentUser._id;
  User.findById(id)
    .then((user) => {
      res.render("profile/editDetails", { logged, user });
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

router.get("/orders", isLoggedIn, function (req, res, next) {
  const logged = true;
  res.render("profile/orders", { logged });
});

router.get("/upload", isLoggedIn, function (req, res, next) {
  const logged = true;
  res.render("profile/upload", { logged });
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
    console.log(id)
    const {name, description, url} = req.body
    console.log(name, description, url)
    const design = await Design.findByIdAndUpdate(id, {name, description, url}, {new: true})
    res.redirect("/profile");
  } catch (error) {
    console.log(err)    
  };
});

module.exports = router;
