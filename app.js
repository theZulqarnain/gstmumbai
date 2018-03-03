var express = require('express');
var app = express();
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport   = require('passport')
var session    = require('express-session');
var FroalaEditor = require('./lib/froalaEditor.js');
var flash = require('connect-flash')


app.use(flash());
   ////////////////////////////////////////////////////////////
///////////////////// start Passport   ///////////////////////////////
   ////////////////////////////////////////////////////////////
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//Models
var models = require("./models");
//var usermodel = require("./models/user");
//debugger;
//load passport strategies
require('./services/passport.js')(passport,models.users);
//Sync Database
models.sequelize.sync().then(function(){
    console.log('Nice! Database looks fine')

}).catch(function(err){
    console.log(err,"Something went wrong with the Database Update!")
});

////////////////////////////////////////////////////////////
///////////////////// End Passport   ///////////////////////////////
////////////////////////////////////////////////////////////

var routes = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/aboutUs');
var jurisdiction = require('./routes/jurisdiction');
var gst = require('./routes/gst');
var serviceTax = require('./routes/serviceTax');
var centralExcise = require('./routes/centralExcise');
var tradeNotices = require('./routes/tradeNotices');
var contactus = require('./routes/contactus');
var RTI = require('./routes/RTI');
var desk = require('./routes/desk');
var information = require('./routes/information');
var whatsNew = require('./routes/whatsNew');

//admin Requires
var admin = require('./routes/admin/index');
var dashboard = require('./routes/admin/dashboard');
var pages = require('./routes/admin/pages');
var user = require('./routes/admin/users');
var notifications = require('./routes/admin/notifications');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})



app.use('/', routes);
app.use('/desk', desk);
app.use('/aboutus',about);
app.use('/jurisdiction',jurisdiction);
app.use('/gst',gst);
app.use('/centralExcise',centralExcise);
app.use('/serviceTax',serviceTax);
app.use('/tradeNotices',tradeNotices);
app.use('/RTI',RTI);
app.use('/contactus',contactus);
app.use('/information',information);
app.use('/whatsNew', whatsNew);
app.use('/users', users);

//admin Routes
app.use('/admin', admin);
app.use('/admin/dashboard',dashboard);
app.use('/admin/pages',pages);
app.use('/admin/users',user(models.user));
app.use('/admin/notifications', notifications);


//app.js squelize section ///


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
