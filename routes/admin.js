const express = require('express');
const path = require('path');

// ----------------------------------------------Importing Controllers
const { getAddProducts, postAddProducts } = require('../controllers/products');

// -----------------------------------------------Initit Router
const Router = express.Router();

// ------------------------------------------------routes
Router.route('/add-product').get(getAddProducts).post(postAddProducts);

module.exports = Router;
