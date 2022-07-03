const express = require("express");
const bodyParser = require("body-parser");
var session = require('express-session');
const app = express();

const port = 8089;

const User = require('./config/firebase_config')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// enable folder /public - contains css files.
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/my_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/my_js', express.static(__dirname + '/node_modules/jquery/dist')); 

app.use(require('connect-flash')());
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'woot',
  resave: false,
  saveUninitialized: false
}));
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



require("./routes/main")(app);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


/*
http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Welcome to the mid-term application! \n\n");
    res.write("This application must run on PORT 8089");
    res.end();
  })
  .listen(8089, function() {
    console.log("Node server is running...");
  }); */
