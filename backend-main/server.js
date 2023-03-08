const express = require("express");
const bodyParser = require("body-parser");
const formData = require('express-form-data');
const cors = require("cors");
const path = require('path');

const app = express();
const db = require("./app/models");


var corsOptions = {
  origin: "http://localhost:8081"
};

// Set render engine to 'ejs'
app.set('view engine', 'ejs');

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(formData.parse());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Force the fb
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
});

// Home route
app.get("/", (req, res) => {
  res.render('index');
});

// Get file for EJS page renders
app.get("/:folder/:filename", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/" + req.params.folder + "/" + req.params.filename));
});

app.get("/api/auth/verify/:folder/:filename", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/" + req.params.folder + "/" + req.params.filename));
});

app.get("/api/auth/resend-verification-link/:folder/:filename", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/" + req.params.folder + "/" + req.params.filename));
});

// Catch error from wrong body parser
app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).send({message: "Bad request: JSON body is invalid"});
  } else next();
});

//All the routes configured
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/referral.routes')(app);
require('./app/routes/application.routes')(app);
require('./app/routes/payment.routes')(app);
require('./app/routes/rating.routes')(app);
require('./app/routes/invalid.routes')(app); // Always have this last from the above

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
