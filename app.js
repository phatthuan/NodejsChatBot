global.__base = __dirname + '/';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const manager = require(__base + "/middlewares/chatbot/languageManager")
const trainNlpManager = require(__base + "/middlewares/chatbot/train")
require('./middlewares/authentication/authGGmiddleware')
require('./middlewares/authentication/authFBmiddleware')
require('./middlewares/authentication/authLCmiddleware')
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/nlp_support_system', {
  useNewUrlParser: true,
})

trainNlpManager(manager);


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'PhatHoangChi',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
