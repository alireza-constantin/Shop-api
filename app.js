//------------------------------------------------ Dependencies and Modules
const express = require('express');

//------------------------------------------------ Local Module

//------------------------------------------------ Initial express
const app = express();

//------------------------------------------------ Body parser
app.use(express.urlencoded({ extended: false }));

//------------------------------------------------Import routes
const admin = require('./routes/admin');
const shop = require('./routes/shop');

// ------------------------------------------------------Using routes
app.use(admin);
app.use(shop);

//------------------------------------------------------- Starting Server
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on ${PORT}... `));
