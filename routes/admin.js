const express = require('express');
const path = require('path');

// ----------------------------------------------Importing Controllers
const {
  getAddProducts,
  postAddProducts,
  getAdminProducts,
  getEditProducts,
  postEditProduct,
} = require('../controllers/admin');

// -----------------------------------------------Initit Router
const Router = express.Router();

// ------------------------------------------------routes
Router.route('/add-product').get(getAddProducts).post(postAddProducts);
Router.route('/products').get(getAdminProducts);
Router.get('/edit-product/:productId', getEditProducts);
Router.post('/edit-product', postEditProduct);
module.exports = Router;
