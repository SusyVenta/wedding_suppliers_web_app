const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const url = require('url');
const usersRouter = require('./routes/users.js')
const productsRouter = require('./routes/product_details.js')
const moment = require('moment');
const {prepareHomePayload} = require('./controllers/HomeController');
const app = express();

// enable to use ejs
app.set("view engine", "ejs")

// enable folder /public - contains css files.
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/my_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/my_js', express.static(__dirname + '/node_modules/jquery/dist'));


app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});

// loads user profile route
app.use('/users', usersRouter);

// loads user profile route
app.use('/product_details', productsRouter);

// home page - does not require authentication
app.get('/home', async function (request, response){
    let indexPath = path.join(__dirname, "views/home.ejs");
  
    const queryObject = url.parse(request.url, true).query;
  
    let payload = await prepareHomePayload(queryObject);
    response.render(indexPath, payload);
  });


// vendor profile
app.get('/vendor_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_profile.ejs");
  response.render(indexPath);
});

exports.app = functions.https.onRequest(app);
