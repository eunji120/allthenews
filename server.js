//npm packages
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();

//public settings
app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000;

//scraping
const request = reuqire("request");
const cheerio = require("cheerio");

//mongodb
const mongoose = require('mongoose');
mongoose.Promise = Promise;
//connecting to mongodb
mongoose.connect("mongodb://localhost/5000", { useNewUrlParser: true });

var URI = process.env.MONGODB_URI || "mongodb://localhost/allthenews1004";
mongoose.connect(URI);

//use morgan loggin
app.use(logger("dev"));

//initialize bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//setting up handlebar
var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//routes
var routes = require('./controllers/news');
app.use('/', routes);

//port
app.listen(5000, () => {
    console.log("App running on port 5000");
});