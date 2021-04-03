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

const isAuth = require('../middleware/isAuth');

// ------------------------------------------------routes
Router.route('/add-product')
  .get(isAuth, getAddProducts)
  .post(isAuth, postAddProducts);
Router.route('/products').get(isAuth, getAdminProducts);
Router.get('/edit-product/:productId', isAuth, getEditProducts);
Router.post('/edit-product', isAuth, postEditProduct);
Router.post('/delete-product', isAuth, deleteProducts);
module.exports = Router;
