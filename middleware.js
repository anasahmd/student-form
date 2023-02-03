const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Please Log in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!(req.user && req.user.role === 'admin')) {
    next(new ExpressError('Page not found', 404));
  }
  next();
};
