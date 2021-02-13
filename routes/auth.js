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
  const { firstName, lastName, email, password, age, gender, street, city, state, country, postcode, picture } = req.body;
  const name = {firstName, lastName}
  const address = { street, city, state, country, postcode }
  console.log(name, email, password, age, gender, address, picture);
  
  User.create({ name, email, password, age, gender, address, picture })
    .then((createdUser) => {
      console.log(createdUser)
      res.redirect('/');
    })
    .catch( (err) => console.log(err));
});

module.exports = router;
