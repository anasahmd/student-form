const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('user/register');
};

module.exports.userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body.user;
    const newUser = new User({
      name,
      email,
      role: 'student',
    });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'User registered successfully');
      res.redirect('/student/apply');
    });
  } catch (e) {
    console.log(e);
    res.redirect('/error');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('user/login');
};

module.exports.userLogin = async (req, res) => {
  if (req.user.role === 'admin') {
    res.redirect('/admin/student');
  } else if (req.user.role === 'student') {
    const user = await req.user.populate('student');
    if (user.student.status === 1) {
      res.redirect('/student/payment');
    } else {
      res.redirect('/student/apply');
    }
  }
};

module.exports.userLogout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};

module.exports.renderForgot = (req, res) => {
  res.render('user/forgotpwd');
};
