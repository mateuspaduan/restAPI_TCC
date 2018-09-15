var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./models/session'), //created model loading here
    Comments = require('./models/comment'),
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admintcc:admintcc2@ds151662.mlab.com:51662/rtfs_tcc');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes/routes'); //importing route
routes(app); //register the route


app.listen(port);
