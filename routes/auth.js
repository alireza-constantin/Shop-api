const express = require('express');
const Router = express.Router();

const { getLogin, postLogin, postLogout } = require('../controllers/auth');

Router.route('/login').get(getLogin).post(postLogin);
Router.route('/logout').post(postLogout);

module.exports = Router;
