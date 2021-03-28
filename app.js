//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');
const ejs = require('ejs');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

//------------------------------------------------ Local and Core Module
const path = require('path');

// Load ENV Variable
dotenv.config({ path: './config/config.env' });

// -----------------------------------------------Database and Models
const mongoConnect = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

//------------------------------------------------ Initial express
const app = express();

mongoConnect();

const store = new mongoDBStore({
  uri:
    'mongodb+srv://alireza123:joker1224@alirezasoheili.qhzx1.mongodb.net/Shop',
  collection: 'session',
});

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

// ------------------------------------------------ Session middleware
app.use(
  session({
    secret: 'alireza soheili',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// -----------------------------------------------Getting User
app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  req.user = user;
  next();
});
// -----------------------------------------------Template Engine --Handlebars

app.set('view engine', 'ejs');

//------------------------------------------------Import routes
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

// ------------------------------------------------------Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------Using routes
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
});

//------------------------------------------------------- Starting Server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}...`.yellow.inverse)
);
