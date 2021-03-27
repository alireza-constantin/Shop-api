const express = require('express');
const Router = express.Router();

const { login } = require('../controllers/auth');

Router.get('/login', login);

module.exports = Router;
