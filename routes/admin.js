const express = require('express');
const path = require('path');

// ----------------------------------------------Importing Controllers
const {
  getAddProducts,
  postAddProducts,
  getAdminProducts,
  getEditProducts,
  postEditProduct,
  deleteProducts,
} = require('../controllers/admin');

// -----------------------------------------------Initit Router
const Router = express.Router();

// ------------------------------------------------routes
Router.route('/add-product').get(getAddProducts).post(postAddProducts);
Router.route('/products').get(getAdminProducts);
Router.get('/edit-product/:productId', getEditProducts);
Router.post('/edit-product', postEditProduct);
Router.post('/delete-product', deleteProducts);
module.exports = Router;
