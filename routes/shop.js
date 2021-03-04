const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const Router = express.Router();

// ----------------------------------------routes
Router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = Router;
