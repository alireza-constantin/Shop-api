const express = require('express');
const path = require('path');

const { products } = require('./admin');
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', (req, res, next) => {
  res.render('shop', {
    pageTitle: 'Shop',
    prods: products,
    isActive: true,
    path: '/',
  });
});

module.exports = Router;
