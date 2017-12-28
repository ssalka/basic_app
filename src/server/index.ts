import * as express from 'express';
import { RequestHandler } from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { User } from 'lib/server/models';
import { sessionConfig } from './config';
import routes from './routes';

if (process.env.NODE_ENV !== 'production') {
  // start webpack dev server
  import('src/server.dev');
}

const app = express();

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app
  .use([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
    session(sessionConfig),
    passport.initialize(),
    passport.session()
  ])
  .use('/', routes)
  .listen(3000);
