var express = require("express");
var router = express.Router();

const zxcvbn = require("zxcvbn");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("./../models/users");

/* GET LOG-IN */
router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

/* POST LOG-IN */
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter username and password",
    });

    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User not found",
        });

        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, user.password);

      if (passwordCorrect) {
        console.log(req.session);
        
        req.session.currentUser = user; // Triggers creation of the session and cookie
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect email or password",
        });
      }
    })
    .catch((err) => next(err));
});

/* GET SIGN-UP */
router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

/* POST SIGN-UP */
router.post("/signup", function (req, res, next) {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    street,
    city,
    state,
    country,
    postcode,
    picture,
  } = req.body;
  const name = { firstName, lastName };
  const address = { street, city, state, country, postcode };

  // Hash the password
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({
    name,
    email,
    password: hashedPassword,
    age,
    gender,
    address,
    picture,
  })
    .then((user) => {
      req.session.currentUser = user; // Triggers creation of the session and cookie
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

/* GET LOG-OUT */
router.get("/logout", (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
