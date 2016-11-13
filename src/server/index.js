const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { db, models: { User } } = require('lib/server');
const routes = require('./routes');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(config.publicPath));
app.use(express.static(config.blueprintPath));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

module.exports = app;
