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
  postOrder,
} = require('../controllers/shop');

// -----------------------------------------Initi Router
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', getIndex);
Router.route('/cart').get(getCart).post(postCart);
Router.get('/products', getProducts);
Router.get('/products/:productId', getProduct);
Router.get('/checkout', getCheckout);
Router.post('/delete-cart-item', postCartDeleteItem);
Router.post('/create-order', postOrder);
Router.get('/orders', getOrders);

module.exports = Router;
