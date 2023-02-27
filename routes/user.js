const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('home');
});

router
  .route('/register')
  .get(user.renderRegister)
  .post(catchAsync(user.userRegister));

router
  .route('/login')
  .get(user.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    catchAsync(user.userLogin)
  );

router.get('/logout', catchAsync(user.userLogout));

router.get('/user/forgotpassword', user.renderForgot);

module.exports = router;
