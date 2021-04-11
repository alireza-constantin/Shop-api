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
  getInvoices,
  postOrderDelete,
} = require('../controllers/shop');

// -----------------------------------------Initi Router
const Router = express.Router();

const isAuth = require('../middleware/isAuth');

// ----------------------------------------routes
Router.get('/', getIndex);
Router.get('/products', getProducts);
Router.get('/products/:productId', getProduct);
Router.route('/cart').get(isAuth, getCart).post(isAuth, postCart);
Router.post('/delete-cart-item', isAuth, postCartDeleteItem);
Router.get('/checkout', isAuth, getCheckout);
Router.get('/checkout/cancel', getCheckout);
Router.get('/checkout/success', postOrder);
Router.get('/orders', isAuth, getOrders);
Router.get('/orders/:orderId', isAuth, getInvoices);
Router.post('/delete-order-item', isAuth, postOrderDelete);

module.exports = Router;
