import * as express from 'express';
import * as middleware from 'lib/server/middleware';

export default express
  .Router()
  .post(
    '/register',
    middleware.user.registerUser,
    middleware.user.loginUser,
    middleware.user.startSession,
    middleware.user.loginSuccess
  )
  .post(
    '/login',
    middleware.user.loginUser,
    middleware.user.startSession,
    middleware.user.loginSuccess
  )
  .post('/logout', middleware.user.closeSession, middleware.user.logout);
