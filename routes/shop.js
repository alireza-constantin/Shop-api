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

const isAuth = require('../middleware/isAuth');

// ----------------------------------------routes
Router.get('/', getIndex);
Router.route('/cart').get(isAuth, getCart).post(isAuth, postCart);
Router.get('/products', getProducts);
Router.get('/products/:productId', getProduct);
Router.post('/delete-cart-item', isAuth, postCartDeleteItem);
Router.post('/create-order', isAuth, postOrder);
Router.get('/orders', isAuth, getOrders);

module.exports = Router;
