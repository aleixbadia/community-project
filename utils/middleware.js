function isLoggedIn (req, res, next) {
    if (req.session.currentUser) { // if user has an authenticated cookie
      next(); 
    } 																
    else {                          	
        res.redirect("/auth/login");    
    }                                 
  }
  
  function isFede(req, res, next) {
    if (req.session.currentUser.username === 'fede123') {
      next()
    }
    else {
      next(new Error('You are not Fede!'))
    }
  }
  
  
  module.exports = {
    isLoggedIn,
    isFede
  }