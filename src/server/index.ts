import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { User } from 'lib/server/models';
import { publicPath, sessionConfig } from './config';
import routes from './routes';

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(session(sessionConfig))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static(publicPath))
  .use('/', routes)
  .listen(3000);
