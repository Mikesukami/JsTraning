var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var jwt = require('jsonwebtoken');

var checkAuth = require('./routes/verify/authMiddleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var verifyRouter = require('./routes/verify/login');
var registerRouter = require('./routes/verify/register');
var productsRouter = require('./routes/products');
var approve = require('./routes/verify/approve');
var orders = require('./routes/orders');
var lab = require('./routes/labs');
var province = require('./routes/province');
var message = require('./routes/message');
var lineNoti = require('./routes/lineNoti');

var app = express();
var cors = require('cors');
require('./db')


app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/login', verifyRouter);
app.use('/api/v1/register', registerRouter);
// app.use('/api/v1/products', checkAuth, productsRouter);
app.use('/api/v1/products', checkAuth ,productsRouter);
app.use('/api/v1/approve', checkAuth, approve);
// app.use('/api/v1/orders', checkAuth, orders);
app.use('/api/v1/orders', orders);
app.use('/api/v1/message', message);
app.use('/api/v1/lab', lab);
app.use('/api/v1/province', province);
app.use('/api/v1/lineNotify', lineNoti);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
