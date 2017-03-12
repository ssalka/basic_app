const passport = require('passport');
const async = require('async');
const { flow, isEmpty, pick } = require('lodash');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { printSchema } = require('graphql/utilities/schemaPrinter');

const { index } = require('../config');
const getGraphQLSchema = require('lib/server/graphql');
const { User, Session, Collection } = require('lib/server/models');
const { logger, generateToken } = require('lib/common');

// Send these fields to client upon successful authentication
const USER_FIELDS = [
  '_id',
  'username',
  'createdAt'
];

module.exports = {
  sendIndex: (_, res) => res.sendFile(index),

  /**
   *  AUTH & REGISTRATION
   */

  findUserByToken(req, res) {
    const { token } = req.session;
    if (!token) return res.status(403).json({
      err: 'No session token was provided'
    });

    async.waterfall([
      cb => Session.findByToken(token).exec(cb),
      (session, cb) => isEmpty(session)
        ? cb({ message: 'No matching document', statusCode: 404 })
        : User.findById(session.user._id).exec(cb),
    ], (err, user) => err
      ? res.status(err.statusCode || 500).json({ err: err.message || err })
      : res.json({ user: pick(user, USER_FIELDS) })
    );
   },

  registerUser(req, res, next) {
    const { username, password } = req.body;
    const user = new User({ username });
    User.register(user, password,
      err => err ? res.status(500).json({ err }) : next()
    );
  },

  loginUser(req, res, next) {
    passport.authenticate('local')(req, res, next);
  },

  startSession(req, res, next) {
    Session.create({
      user: pick(req.user, ['_id', 'username']),
      token: generateToken()
    }, (err, sess) => {
      if (err) return next(err);
      Object.assign(req.session,
        pick(sess, ['user', 'token'])
      );
      next();
    });
  },

  loginSuccess(req, res) {
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

        async.parallel([
          cb => session.remove(cb),
          cb => req.session.destroy(cb)
        ], err => err ? next(err) : next());
      })
      .catch(err => {
        res.status(500).json({ err });
      });
  },

  logout(req, res) {
    const { username } = req.user;
    req.logout();
    res.json({ username });
  },

  /**
   * GRAPHQL ENDPOINTS
   */

  graphql: graphqlExpress(({ body, user }) => ({
    schema: getGraphQLSchema(body),
    context: { user }
  })),

  graphiql: graphiqlExpress({ endpointURL: '/graphql' }),

  schema(_, res) {
    res.set(
      'Content-Type',
      'text/plain'
    );
    flow(
      res.send,
      printSchema,
      getGraphQLSchema
    )(req.body);
  }
};
