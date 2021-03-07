//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');
const exphbs = require('express-handlebars');
//------------------------------------------------ Local and Core Module
const path = require('path');

//------------------------------------------------ Initial express
const app = express();

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

// -----------------------------------------------Template Engine --Handlebars
app.engine(
  'handlebars',
  exphbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main' })
);
app.set('view engine', 'handlebars');

//------------------------------------------------Import routes
const admin = require('./routes/admin');
const shop = require('./routes/shop');

// ------------------------------------------------------Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------Using routes
app.use('/admin', admin);
app.use(shop);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Not Found' });
});

//------------------------------------------------------- Starting Server
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`.yellow));
