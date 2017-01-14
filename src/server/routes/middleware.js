const passport = require('passport');
const async = require('async');
const { isEmpty, pick } = require('lodash');
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

// Load collections on app start to inject into GraphQL
let collections;
Collection.find().populate({ path: 'creator', model: User }).exec()
  .then(docs => collections = docs)
  .catch(console.error);

module.exports = {
  sendIndex(req, res) {
    res.sendFile(index);
  },

  /**
   *  AUTH & REGISTRATION
   */

  findUserByToken(req, res) {
    const { token } = req.session;
    if (!token) return res.status(403).json({
      err: 'No session token was provided'
    });

    Session.findByToken(token)
      .then(session => {
        if (!session) res.status(404);

        const response = isEmpty(session)
          ? { err: 'No matching document' }
          : { user: pick(session.user, USER_FIELDS) };

        res.json(response);
      })
      .catch(err => {
        res.status(500).json({ err });
      });
   },

  registerUser(req, res, next) {
    const { username, password } = req.body;

    async.waterfall([
      cb => cb(null, new User({ username })),
      (user, cb) => User.register(user, password, cb),
    ], err => err ? res.json({ err }) : next());
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

        async.series([
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
   * USER ENDPOINTS
   */

  getUser(req, res) {
    if (!req.user) res.status(404);

    const user = pick(req.user, USER_FIELDS);
    const err = 'No user found';

    res.json(req.user ? { user } : { err });
  },

  /**
   * GRAPHQL ENDPOINTS
   */

  graphql(req, res) {
    graphqlExpress({
      schema: getGraphQLSchema(collections),
      context: { user: req.user }
    })(req, res);
  },

  graphiql: graphiqlExpress({ endpointURL: '/graphql' }),

  schema(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send(printSchema(schema));
  }
};
