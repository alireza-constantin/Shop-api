const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const Router = express.Router();

const products = [];

// ------------------------------------------------routes
Router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    prods: products,
    isActive: true,
    path: '/admin/add-product',
  });
});

Router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports = {
  Router,
  products,
};
// module.exports = products;
