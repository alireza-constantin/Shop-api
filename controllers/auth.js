const User = require('../models/user');
const asyncHandler = require('../util/asyncHandler');
const bcrypt = require('bcryptjs');

module.exports.getLogin = asyncHandler(async (req, res, next) => {
  await res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isloggedIn,
  });
});

module.exports.postLogin = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.redirect('/login');
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (isMatch) {
    req.session.isloggedIn = true;
    req.session.user = user;
    await req.session.save((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  } else if (!isMatch) {
    res.redirect('/login');
  }
});

module.exports.postLogout = asyncHandler(async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

module.exports.getSignup = asyncHandler(async (req, res, next) => {
  await res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
});

module.exports.postSignup = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    return res.redirect('/signup');
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  });

  await user.save();
  await res.redirect('/login');
});
