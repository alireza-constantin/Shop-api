const express = require('express');

const Router = express.Router();

// ------------------------------------------------routes
Router.get('/add-product', (req, res, next) => {
  res.send(
    '<form action="/products" method="POST"><input type="text" name="title"><button type="submit">SEND</button></form>'
  );
});

Router.post('/products', (req, res, next) => {
  res.redirect('/');
});

module.exports = Router;
