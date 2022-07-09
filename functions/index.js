const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();

//app.use(express.static(__dirname + '../public'));

// enable folder /public - contains css files.
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/my_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/my_js', express.static(__dirname + '/node_modules/jquery/dist'));


app.get('/', (request, response) => {
  let indexPath = path.join(__dirname, "views/home.html");
  response.sendFile(indexPath);
})

app.get('/login', (request, response) => {
  let indexPath = path.join(__dirname, "views/customer_login.html");
  response.sendFile(indexPath);
})

app.get('/vendor_login', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_login.html");
  response.sendFile(indexPath);
})

app.get('/user_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/user_profile.html");
  response.sendFile(indexPath);
})

app.get('/vendor_profile', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_profile.html");
  response.sendFile(indexPath);
})

app.get('/vendor_reg', (request, response) => {
  let indexPath = path.join(__dirname, "views/vendor_reg.html");
  response.sendFile(indexPath);
})

app.get('/admin_routes', (request, response) => {
  let routes = [" /, => home.html "," /login, => customer_login.html "," /vendor_login => vendor_login.html "," /user_profile => user_profile.html "," /vendor_reg => vendor_reg.html "," /vendor_profile => vendor_profile.html "]
  response.send(`${routes}`);
})

app.get('/timestamp', (request, response) => {
  response.send(`${Date.now()}`);
})

exports.app = functions.https.onRequest(app);
