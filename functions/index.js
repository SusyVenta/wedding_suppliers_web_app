const functions = require('firebase-functions');
const express = require('express');
const usersRouter = require('./routes/users.js');
const homeRouter = require('./routes/home.js');
const vendorRouter = require('./routes/vendor.js');
const productsRouter = require('./routes/product_details.js');
const app = express();

// enable to use ejs
app.set("view engine", "ejs")

// enable folder /public - contains css files.
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/my_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/my_js', express.static(__dirname + '/node_modules/jquery/dist'));

// load routes. Routes are defined in separate files to keep index.js clean
app.use('/users', usersRouter);
app.use('/product_details', productsRouter);
app.use(homeRouter);
app.use(vendorRouter);

exports.app = functions.https.onRequest(app);
