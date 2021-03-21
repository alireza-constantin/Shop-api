//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');
const ejs = require('ejs');
const dotenv = require('dotenv');
//------------------------------------------------ Local and Core Module
const path = require('path');

// Load ENV Variable
dotenv.config({ path: './config/config.env' });

// -----------------------------------------------Database and Models
const mongoConnect = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-items');
// const OrderItem = require('./models/order-items');
// const Order = require('./models/order');

//------------------------------------------------ Initial express
const app = express();

mongoConnect();

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

// -----------------------------------------------Template Engine --Handlebars

app.set('view engine', 'ejs');

//------------------------------------------------Import routes
// const adminRouter = require('./routes/admin');
// const shop = require('./routes/shop');

// ------------------------------------------------------Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------Using routes
// app.use('/admin', adminRouter);
// app.use(shop);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Not Found', path: '/404' });
});

//------------------------------------------------------- Starting Server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}...`.yellow)
);
