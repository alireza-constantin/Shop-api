const User = require('../models/user');
const asyncHandler = require('../util/asyncHandler');
const bcrypt = require('bcryptjs');
const transporter = require('../util/nodeMailer');
const nodemailer = require('nodemailer');

module.exports.getLogin = asyncHandler(async (req, res, next) => {
  let message = req.flash('error');
  // if (message.length > 0) {
  //   message = message[0];
  // } else if (message.length === 0) {
  //   message = null;
  // }
  await res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/login',
    errMsg: message,
  });
});

module.exports.postLogin = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    await req.flash('error', 'Invalid email or password.');
    return await res.redirect('/login');
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
    await req.flash('error', 'Invalid email or password.');
    return await res.redirect('/login');
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
  let message = req.flash('error');
  // if (message.length > 0) {
  //   message = message[0];
  // } else if (message.length === 0) {
  //   message = null;
  // }
  await res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errMsg: message,
  });
});

module.exports.postSignup = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    await req.flash('error', 'Email Already Exists.');
    return await res.redirect('/signup');
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  });

  await user.save();
  await transporter.sendMail(
    {
      from: 'Shop@Constantin',
      to: email,
      subject: 'SignUp Successful', // Subject line
      html: '<h1>Your Account Successfuly Created.</h1>', // html body
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    }
  );
  await res.redirect('/login');
});
