const { body } = require('express-validator');

exports.isValid = (req) => {
  return [
    body('email', 'Please enter a valid email.').isEmail(),
    body(
      'password',
      'Password should be combination of one lower case, one digit and min 8 , max 16 character long'
    )
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, 'i'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password Should be match!');
      }
      return true;
    }),
  ];
};
