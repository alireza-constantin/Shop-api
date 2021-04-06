const crypto = require('crypto');
const User = require('../models/user');
const asyncHandler = require('../util/asyncHandler');
const bcrypt = require('bcryptjs');
const transporter = require('../util/nodeMailer');
const nodemailer = require('nodemailer');
const user = require('../models/user');
const { validationResult } = require('express-validator');

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

  await res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errMsg: message,
    oldInput: { email: '', password: '', confirmPass: '' },
  });
});

module.exports.postSignup = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errMsg: errors.array()[0].msg,
      oldInput: { email, password, confirmPass },
    });
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
      subject: 'SignUp Successful',
      html: '<h1>Your Account Successfuly Created.</h1>',
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    }
  );
  await res.redirect('/login');
});

exports.getReset = asyncHandler(async (req, res, next) => {
  await res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errMsg: req.flash('not found'),
  });
});

exports.postReset = asyncHandler(async (req, res, next) => {
  await crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      await req.flash('not found', 'Email Not found.');
      return await res.redirect('/reset');
    }

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 10;

    await user.save();
    await res.redirect('/');
    await transporter.sendMail(
      {
        from: 'Shop@Constantin',
        to: req.body.email,
        subject: 'Reset Password',
        html: `<p>You Requested a Password Reset<p>
        <p>If You Did Not Do This Ignore This E-Mail</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to Set the New Password</p>
        `,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      }
    );
  });
});

exports.getNewPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return await res.redirect('/');
  }
  await res.render('auth/new-password', {
    path: 'new-password',
    pageTitle: 'New Password',
    errMsg: req.flash('err'),
    userId: user._id.toString(),
    userToken: token,
  });
});

exports.postNewPassword = asyncHandler(async (req, res, next) => {
  const token = req.body.userToken;
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
    _id: userId,
  });

  const hashPass = await bcrypt.hash(newPassword, 12);
  user.password = hashPass;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();
  await res.redirect('/');
});
