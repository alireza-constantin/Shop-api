const express = require('express');

// ----------------------------------------Import Controllers
const { getProducts } = require('../controllers/products');

// -----------------------------------------Initi Router
const Router = express.Router();

// ----------------------------------------routes
Router.get('/', getProducts);

module.exports = Router;
