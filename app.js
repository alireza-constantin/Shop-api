//------------------------------------------------ Dependencies
const express = require('express');
const colors = require('colors');

//------------------------------------------------ Local and Core Module
const path = require('path');

//------------------------------------------------ Initial express
const app = express();

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

//------------------------------------------------Import routes
const admin = require('./routes/admin');
const shop = require('./routes/shop');

// ------------------------------------------------------Using routes
app.use('/admin', admin);
app.use(shop);

// ------------------------------------------------------404 page
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

//------------------------------------------------------- Starting Server
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`.yellow));
