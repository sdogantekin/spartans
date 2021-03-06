var express          = require('express');
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var mongoose         = require("mongoose");
var config           = require("./config/config");
var passport         = require("passport");
var session          = require("express-session");
var expressValidator = require('express-validator');
var flash            = require("connect-flash");
var mongoStore       = require("connect-mongo")(session);

var passportSetup    = require("./passport/setup");
var routes           = require("./routes/main");
var scheduler        = require("./scheduler/kue_scheduler");

var app = express();

mongoose.connect(config.mongo.url);

var sessionStore = new mongoStore({
    mongooseConnection: mongoose.connection
});

passportSetup();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components/')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : config.sessionSecret,
    resave : true,
    saveUninitialized : true,
    store: sessionStore
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// initialize scheduler
// current scheduler uses kue, which requires a redis instance
//scheduler.initializeKue();
//scheduler.createTestJobs();

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;