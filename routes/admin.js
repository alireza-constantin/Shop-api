const express = require('express');
const path = require('path');

// ----------------------------------------------Importing Controllers
const {
  getAddProducts,
  postAddProducts,
  getAdminProducts,
} = require('../controllers/admin');

// -----------------------------------------------Initit Router
const Router = express.Router();

// ------------------------------------------------routes
Router.route('/add-product').get(getAddProducts).post(postAddProducts);
Router.route('/products').get(getAdminProducts);

module.exports = Router;
