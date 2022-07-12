const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users.js')
const vendorsRouter = require('./routes/vendors.js');
const mock_db = require('./mock_db/mock_db.js');

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

  response.render(indexPath, {
    products: mock_db.products
  });
})

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
