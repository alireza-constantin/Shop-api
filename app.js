//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');
const ejs = require('ejs');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');

//------------------------------------------------ Local and Core Module
const path = require('path');
const asyncHandler = require('./util/asyncHandler');

// -----------------------------------------------Load ENV Variable
dotenv.config({ path: './config/config.env' });

// -----------------------------------------------Database and Models
const mongoConnect = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

//------------------------------------------------ Init express
const app = express();

//------------------------------------------------Init Database
mongoConnect();

// ------------------------------------------------Storing Session In Database
const store = new mongoDBStore({
  uri:
    'mongodb+srv://alireza123:joker1224@alirezasoheili.qhzx1.mongodb.net/Shop',
  collection: 'session',
});

//------------------------------------------------ Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// ------------------------------------------------ Session middleware
app.use(
  session({
    secret: 'alireza soheili',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// ---------------------------------------------------Multer middleware for uploda file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

app.use(
  multer({ storage: storageFile, fileFilter: fileFilter }).single('image')
);

// ------------------------------------------------Prevent Cross-Site Request Forgery -Security --csurf
const csrfProtection = csrf();

app.use(csrfProtection);

// -------------------------------------------------------

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isloggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// -----------------------------------------------Getting User
app.use(
  asyncHandler(async (req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
);
// -----------------------------------------------Template Engine --ejs

app.set('view engine', 'ejs');

// -------------------------------------------------Init Flash message
app.use(flash());

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
    isAuthenticated: req.session.isloggedIn,
  });
});

// -------------------------------------------------------500 page
// app.use((err, req, res, next) => {
//   res.status(500).render('500', {
//     pageTitle: 'Server Error',
//     path: '/500',
//     isAuthenticated: req.session.isloggedIn,
//   });
// });

//------------------------------------------------------- Starting Server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}...`.yellow.inverse)
);
