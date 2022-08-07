const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const url = require('url');
const usersRouter = require('./routes/users.js')
const vendorsRouter = require('./routes/vendors.js');
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

app.use('/users', usersRouter);
app.use('/vendors', vendorsRouter);
app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});


// home page
app.get('/', async function (request, response){
  let indexPath = path.join(__dirname, "views/home.ejs");

  const queryObject = url.parse(request.url, true).query;

  let payload = await prepareHomePayload(queryObject);

  response.render(indexPath, payload);
});

// product details
app.get("/product_details/:product_id", async function (request, response) {
  let indexPath = path.join(__dirname, "views/product_details.ejs");
  let chosenProductId = request.params.product_id;
  
  let payload = await prepareProductPagePayload(chosenProductId);

  console.log(payload.product);
  response.render(indexPath, {
    product: payload.product,
    moment: moment,
    orderRequestSubmitted: false,
    addedToBasket: false
  });
});

// product details post - when user clicks 'confirm availability
app.post("/product_details/:product_id", async function (request, response) {
  let indexPath = path.join(__dirname, "views/product_details.ejs");
  let chosenProductId = request.params.product_id;
  
  let orderRequestSubmitted;
  let addedToBasket;
  let action;
  if("add_to_basket" in request.body){
    addedToBasket = true;
    action = "add_to_basket";
  }
  if("confirm_availability" in request.body){
    orderRequestSubmitted = true;
    action = "confirm_availability";
  }

  let payload = await confirmProductRequestSubmit(chosenProductId, request, action);
  
  response.render(indexPath, {
    product: payload.product,
    moment: moment,
    orderRequestSubmitted: orderRequestSubmitted,
    addedToBasket: addedToBasket
  });
});


// TODO move to routes/vendor.js
app.get('/vendor_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_profile.ejs");
  let vendor_id = 2; //to make dynamic based on login
  //let vendorOrders = filterProductsBy(mock_db.orders, "vendor_id", vendor_id);
  response.render(indexPath);
});

app.get('/user_profile', async (request, response) => {
  let indexPath = path.join(__dirname, "views/user_profile.ejs");

  const queryObject = url.parse(request.url, true).query;
  let payload = await prepareHomePayload(queryObject);
  console.log(payload);
  let params = {email: "....", todo: []};
  response.render(indexPath, {
    products: payload.products,
    params: params
  });
})

app.get('/vendor_login', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_login.ejs");
  response.render(indexPath);
})

app.get('/admin_routes', (request, response) => {
  let routes = [
    " /, => home.html ",
    " users/login, => customer_login.ejs ", " users/:userId/profile => user_profile.ejs ",
    " /vendor_login => vendor_login.html ", " /vendor_profile => vendor_profile.ejs",
    " vendors/reg => vendor_reg.ejs "
  ]
  response.send(`${routes}`);
})

exports.app = functions.https.onRequest(app);
