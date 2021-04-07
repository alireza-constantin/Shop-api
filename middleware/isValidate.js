const { body } = require('express-validator');
const User = require('../models/user');

exports.isValidSignup = (req) => {
  return [
    body('email', 'Please enter a valid email.')
      .isEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              'Email exists already, Please enter another email.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Password should be combination of one lower case, one digit and min 8 , max 16 character long'
    )
      .isLength({ min: 8, max: 16 })
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, 'i'),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password Should be match!');
        }
        return true;
      }),
  ];
};

exports.isValidSignin = (req) => {
  return [
    body('email', 'Please enter a valid email').isEmail().trim(),
    body(
      'password',
      'Password should be combination of one lower case, one digit and min 8 , max 16 character long'
    )
      .trim()
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, 'i'),
  ];
};
