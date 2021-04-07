const express = require('express');
const Router = express.Router();

const {
  getLogin,
  postLogin,
  postLogout,
  postSignup,
  getSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');

const { isValidSignup, isValidSignin } = require('../middleware/isValidate');

Router.route('/login').get(getLogin).post(isValidSignin(), postLogin);

Router.route('/logout').post(postLogout);

Router.route('/signup').get(getSignup).post(isValidSignup(), postSignup);

Router.route('/reset').get(getReset).post(postReset);

Router.route('/reset/:token').get(getNewPassword);

Router.route('/new-password').post(postNewPassword);

module.exports = Router;
