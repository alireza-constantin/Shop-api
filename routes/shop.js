const express = require('express');

// ----------------------------------------Import Controllers
const {
  getProducts,
  getCart,
  getIndex,
  getCheckout,
  getOrders,
} = require('../controllers/shop');

// -----------------------------------------Initi Router
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', getIndex);
Router.get('/cart', getCart);
Router.get('/products', getProducts);
Router.get('/checkout', getCheckout);
Router.get('/orders', getOrders);

module.exports = Router;
