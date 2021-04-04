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
} = require('../controllers/auth');

Router.route('/login').get(getLogin).post(postLogin);

Router.route('/logout').post(postLogout);

Router.route('/signup').get(getSignup).post(postSignup);

Router.route('/reset').get(getReset).post(postReset);

module.exports = Router;
