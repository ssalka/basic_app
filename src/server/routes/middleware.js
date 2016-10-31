const passport = require('passport');
const async = require('async');
const { isEmpty, pick } = require('lodash');

const { index } = require('../config').paths;
const { User, Session } = require('lib/server/models');
const { logger, generateToken } = require('lib/common');

// Send these fields to client upon successful authentication
const USER_FIELDS = [
  '_id',
  'username',
  'createdAt',
  'library'
];

module.exports = {
  sendIndex(req, res) {
    res.sendFile(index);
  },

  /**
   *  AUTH & REGISTRATION
   */

  findUserByToken(req, res, next) {
     const { token } = req.session;
     if (!token) return res.status(403).json({
       err: 'No session token was provided'
     });

     Session.findByToken(token)
       .then(session => res.json(!isEmpty(session)
          ? { user: pick(req.user || session, USER_FIELDS) }
          : { err: 'No matching document' }
       ))
       .catch(console.error);
   },

  registerUser(req, res, next) {
    const { username, password } = req.body;
    const user = new User({ username });

    User.register(user, password, (err, user) => {
      err ? res.json({ err }) : next();
    });
  },

  loginUser(req, res, next) {
    passport.authenticate('local')(req, res, next);
  },

  startSession(req, res, next) {
    const session = new Session({
      user: pick(req.user, ['_id', 'username']),
      token: generateToken()
    });

    session.save((err, sess) => {
      if (err) return next(err);
      Object.assign(req.session,
        pick(sess, ['user', 'token'])
      );
      next();
    });
  },

  loginSuccess(req, res, next) {
    const { session, user } = req;

    res.json({
      user: pick(user, USER_FIELDS),
      token: session.token
    });
  },

  /**
   *  LOGOUT
   */

  closeSession(req, res, next) {
    Session.findByToken(req.session.token)
      .then((session, err) => {
        if (err || !session) return next(
          err || 'Session not found'
        );

        async.series([
          cb => session.remove(cb),
          cb => req.session.destroy(cb)
        ], err => err ? next(err) : next());
      })
      .catch(console.error);
  },

  logout(req, res) {
    const { username } = req.user;
    req.logout();
    res.json({ username });
  },

  /**
   * USER ENDPOINTS
   */

  getUser(req, res, next) {
    if (!req.user) res.status(404);

    const user = pick(req.user, USER_FIELDS);
    const err = 'No user found';

    res.json(req.user ? { user } : { err });
  }
};
