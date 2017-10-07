import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { User } from 'lib/server/models';

import routes from './routes';
import * as config from './config';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(config.publicPath));

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);

app.listen(3000, () => {
  console.log('express server listening on port 3000');
});
