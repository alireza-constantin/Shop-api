const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const Router = express.Router();

// ------------------------------------------------routes
Router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

Router.post('/add-product', (req, res, next) => {
  res.redirect('/');
});

module.exports = Router;
