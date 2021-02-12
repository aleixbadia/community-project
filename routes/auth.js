var express = require('express');
var router = express.Router();

const User = require('./../models/users');

/* GET authentifications. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

/* POST authentifications. */
router.post('/signup', function(req, res, next) {
  const { firstName, lastName, email, password, age, street, city, state, country, postcode } = req.body;

  User.create({ firstName, lastName, email, password, age, street, city, state, country, postcode, profilePicture })
    .then((createdUser) => {
      console.log(createdUser)
      res.redirect('/');
    })
    .catch( (err) => console.log(err));
});

module.exports = router;
