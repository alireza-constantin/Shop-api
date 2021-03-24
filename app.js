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
const Product = require('./models/product');
const User = require('./models/user');

//------------------------------------------------ Initial express
const app = express();

mongoConnect();

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

// -----------------------------------------------Getting User
app.use(async (req, res, next) => {
  const user = await User.findById('605afa736319211df8e68be9');
  req.user = user;
  next();
});
// -----------------------------------------------Template Engine --Handlebars

app.set('view engine', 'ejs');

//------------------------------------------------Import routes
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

// ------------------------------------------------------Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------Using routes
app.use('/admin', adminRouter);
app.use(shopRouter);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Not Found', path: '/404' });
});

//-------------------------------------------------------Creating User
const exiUser = User.findOne();
if (!exiUser) {
  const user = new User({
    name: 'Alireza',
    email: 'alireza@mail.com',
    cart: {
      items: [],
    },
  });
  user.save();
}

//------------------------------------------------------- Starting Server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}...`.yellow.inverse)
);
