var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
var methodOverride = require('method-override')
var app = express();

//passport
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//bcrypt
const bcryptjs = require('bcryptjs');

//prisma
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const filesRouter = require('./routes/files');
const foldersRouter = require('./routes/folders');

//session
app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(flash());
app.use(methodOverride('_method'))

//passport strat
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.secretusers.findUnique({
        where: { username: username }
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcryptjs.compare(password, user.password);
      if(!match) {
        return done(null, false, {message: "incorrect password"})
      }
      
      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.secretusers.findUnique({
      where: {id},
    })

    done(null, user);
  } catch(err) {
    done(err);
  }
});



    


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/files', filesRouter);
app.use('/folders', foldersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
