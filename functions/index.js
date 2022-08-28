const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const url = require('url');
const usersRouter = require('./routes/users.js')
const moment = require('moment');
const {prepareHomePayload} = require('./controllers/HomeController');
const {prepareProductPagePayload, confirmProductRequestSubmit} = require('./controllers/ProductPageController');
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

// home page - does not require authentication
app.get('/home', async function (request, response){
    let indexPath = path.join(__dirname, "views/home.ejs");
  
    const queryObject = url.parse(request.url, true).query;
  
    let payload = await prepareHomePayload(queryObject);
    response.render(indexPath, payload);
  });

// product details - does not require authentication
app.get("/product_details/:product_id", async function (request, response) {
  let indexPath = path.join(__dirname, "views/product_details.ejs");
  let chosenProductId = request.params.product_id;
  
  let payload = await prepareProductPagePayload(chosenProductId);

  response.render(indexPath, {
    product: payload.product,
    moment: moment,
    orderRequestSubmitted: false,
    addedToBasket: false,
    is_authenticated: true
  });
});

// product details post - when user clicks 'confirm availability' or 'add to basket' - requires auth
app.post("/product_details/:product_id", async function (request, response) {
  let indexPath = path.join(__dirname, "views/product_details.ejs");
  let chosenProductId = request.params.product_id;
  let orderRequestSubmitted;
  let addedToBasket;
  let action;
  let user_id = request.body.user_id;
  let is_authenticated;

  if(user_id == "unauthenticated" || user_id == null || user_id == '' || user_id == undefined){
    is_authenticated = false;
    orderRequestSubmitted = false;
    addedToBasket = false;
  }else{
    is_authenticated = true;
    if("add_to_basket" in request.body){
      addedToBasket = true;
      action = "add_to_basket";
    }
    if("confirm_availability" in request.body){
      orderRequestSubmitted = true;
      action = "confirm_availability";
    }
    if (action === undefined) {
      action = request.body.action;
    }
  }

  let payload = await confirmProductRequestSubmit(chosenProductId, request, action, is_authenticated);
  
  response.render(indexPath, {
    product: payload.product,
    moment: moment,
    orderRequestSubmitted: orderRequestSubmitted,
    addedToBasket: addedToBasket,
    is_authenticated: is_authenticated
  });
});

// vendor profile
app.get('/vendor_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_profile.ejs");
  response.render(indexPath);
});

exports.app = functions.https.onRequest(app);
