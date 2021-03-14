const express = require('express');

// ----------------------------------------Import Controllers
const {
  getProducts,
  getProduct,
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
Router.get('/products/:productId', getProduct);
Router.get('/checkout', getCheckout);
Router.get('/orders', getOrders);

module.exports = Router;
