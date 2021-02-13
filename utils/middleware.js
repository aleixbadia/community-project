function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    // if user has an authenticated cookie
    next();
  } else {
    res.redirect("/auth/login");
  }
}

function getVotes(design) {
  const Vote = require("./../models/votes");
  Vote.find({ designId: design._id })
    .then((votes) => {
      return votes.length;
    })
    .catch((err) => console.log(err));
}

function getVotesRating(design) {
  const Vote = require("./../models/votes");
  let totalVotes = 0;
  Vote.find({ designId: design._id })
    .then((votes) => {
      console.log(votes);
      votes.forEach((vote) => {
        totalVotes += vote.rating
      });
      return totalVotes;
    })
    .catch((err) => console.log(err));
}

module.exports = {
  isLoggedIn,
  getVotes,
  getVotesRating,
};
