var express = require("express");
var router = express.Router();
const User = require("./../models/users");
const { isLoggedIn } = require("./../utils/middleware");

/* GET users listing. */
router.get("/", isLoggedIn, function (req, res, next) {
  const logged = true;
  const id = req.session.currentUser._id;
  User.findById(id)
    .then((user) => {
      res.render("profile/user", { logged, user });
    })
    .catch((err) => console.log(err));
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

module.exports = router;
