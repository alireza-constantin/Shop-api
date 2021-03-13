const express = require('express');

// ----------------------------------------Import Controllers
const {
  getProducts,
  getCart,
  getIndex,
  getCheckout,
} = require('../controllers/shop');

// -----------------------------------------Initi Router
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', getIndex);
Router.get('/cart', getCart);
Router.get('/products', getProducts);
Router.get('/checkout', getCheckout);

module.exports = Router;
