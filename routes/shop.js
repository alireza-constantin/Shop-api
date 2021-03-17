const express = require('express');

// ----------------------------------------Import Controllers
const {
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  getIndex,
  getCheckout,
  getOrders,
} = require('../controllers/shop');

// -----------------------------------------Initi Router
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', getIndex);
Router.route('/cart').get(getCart).post(postCart);
Router.get('/products', getProducts);
Router.get('/products/:productId', getProduct);
Router.get('/checkout', getCheckout);
Router.get('/orders', getOrders);
Router.post('/delete-cart-item', postCartDeleteItem);

module.exports = Router;
