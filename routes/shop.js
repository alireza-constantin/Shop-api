const express = require('express');

const Router = express.Router();

// ----------------------------------------routes
Router.get('/', (req, res, next) => {
  res.send('<h1>Hello from the other side</h1>');
});

module.exports = Router;
