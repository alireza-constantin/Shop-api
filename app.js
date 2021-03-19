//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');
const ejs = require('ejs');
//------------------------------------------------ Local and Core Module
const path = require('path');
const mysql = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
//------------------------------------------------ Initial express
const app = express();

// ------------------------------------------------

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

// -----------------------------------------------Template Engine --Handlebars

app.set('view engine', 'ejs');

//------------------------------------------------Import routes
const adminRouter = require('./routes/admin');
const shop = require('./routes/shop');
const sequelize = require('./util/database');

// ------------------------------------------------------Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
// ------------------------------------------------------Using routes
app.use('/admin', adminRouter);
app.use(shop);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Not Found', path: '/404' });
});

// -------------------------------------------------------Relating Database
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// -------------------------------------------------------Init Database
sequelize
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Alireza', email: 'alireza@yahoo.com' });
    }
    return user;
  })
  .then((user) => {
    //------------------------------------------------------- Starting Server
    const PORT = 3000 || process.env.PORT;
    app.listen(PORT, () =>
      console.log(`Server is running on ${PORT}...`.yellow)
    );
  })
  .catch((err) => console.log(err));
