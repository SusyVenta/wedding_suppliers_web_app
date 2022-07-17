const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const url = require('url');
const usersRouter = require('./routes/users.js')
const vendorsRouter = require('./routes/vendors.js');
const {mock_db, distinctCountries, distinctCities, filterProductsBy} = require('./mock_db/mock_db.js');
let Country = require('country-state-city').Country;
let City = require('country-state-city').City;

const app = express();

// enable to use ejs
app.set("view engine", "ejs")

// enable folder /public - contains css files.
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/my_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/my_js', express.static(__dirname + '/node_modules/jquery/dist'));

app.use('/users', usersRouter)
app.use('/vendors', vendorsRouter)

// home page
app.get('/', (request, response) => {
  let indexPath = path.join(__dirname, "views/home.ejs");

  //const allCountries = Country.getAllCountries();
  //const cities = City.getAllCities();

  /*let sqlquery = "SELECT * FROM products GROUP BY rating, price order by rating desc, price asc;";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                request.flash("error", err.message + "," + "None" + ",/,GET");
                response.redirect('/error');
            } else {
                response.render(indexPath, {
                  products: result
                });
            };
        }); */
  const queryObject = url.parse(request.url, true).query;
  const isEmpty = Object.keys(queryObject).length === 0;
  console.log(isEmpty);

  console.log(queryObject);
  let payload;
  if (isEmpty){
    payload = {
      products: mock_db.products,
      allCountries: distinctCountries,
      cities: distinctCities,
      categories: mock_db.product_categories,
      colors: mock_db.colors,
      weddingTypes: mock_db.wedding_types,
      appliedFilters: {
        chosenCountry: "All",
        chosenCity: "All",
        chosenCategory: "All",
        chosenColor: "All",
        chosenWeddingType: "All"
      }
    }
  }else{
    let products = mock_db.products;

    let chosenCountry = queryObject.country;
    // validate input
    if (chosenCountry == "All" | distinctCountries.has(chosenCountry)){
      if(chosenCountry != "All"){
        products = filterProductsBy(products, "available_countries", chosenCountry);
      }
    }
    let chosenCity = queryObject.city;
    if (chosenCity == "All" | distinctCities.has(chosenCity)){
      if(chosenCity != "All"){
        products = filterProductsBy(products, "available_cities", chosenCity);
      }
    }

    let chosenCategory = queryObject.category;
    if (chosenCategory == "All" | mock_db.product_categories.includes(chosenCategory)){
      if(chosenCategory != "All"){
        products = filterProductsBy(products, "category", chosenCategory);
      }
    }
    let chosenColor = queryObject.color;
    if (chosenColor == "All" | mock_db.colors.includes(chosenColor)){
      if(chosenColor != "All"){
        products = filterProductsBy(products, "colors", chosenColor);
      }
    }
    let chosenWeddingType = queryObject.weddingType;
    if (chosenWeddingType == "All" | mock_db.wedding_types.includes(chosenWeddingType)){
      if(chosenWeddingType != "All"){
        products = filterProductsBy(products, "wedding_types", chosenWeddingType);
      }
    }

    payload = {
      products: products,
      allCountries: distinctCountries,
      cities: distinctCities,
      categories: mock_db.product_categories,
      colors: mock_db.colors,
      weddingTypes: mock_db.wedding_types,
      appliedFilters: {
        chosenCountry: chosenCountry,
        chosenCity: chosenCity,
        chosenCategory: chosenCategory,
        chosenColor: chosenColor,
        chosenWeddingType: chosenWeddingType
      }
    }
  }

  response.render(indexPath, payload);
});



// product details
app.get("/product:details/:product_id", function (request, response) {
  let indexPath = path.join(__dirname, "views/product_details.ejs");
  let chosenProductId = request.params.product_id;
  let sqlquery = "SELECT * FROM products WHERE product_id = ?;";
  response.render(indexPath, {
    product: mock_db.products[0]
  });
});


// TODO move to routes/vendor.js
app.get('/vendor_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_profile.ejs");
  response.render(indexPath);
});

app.get('/user_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/user_profile.ejs");
  response.render(indexPath);
  response.render(indexPath, {
    products: mock_db.products
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
