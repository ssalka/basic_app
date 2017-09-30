const passport = require('passport');
const async = require('async');
const _ = require('lodash');
const { invoke, invokeMap } = require('lodash/fp');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { printSchema } = require('graphql/utilities/schemaPrinter');

const { index } = require('../config');
const getGraphQLSchema = require('lib/server/graphql');
const { User, Session, Collection } = require('lib/server/models');
const { ModelGen } = require('lib/server/utils');
const { logger, generateToken } = require('lib/common');
const { READONLY_FIELDS } = require('lib/common/constants');

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
    if (!token) return res.status(403).send('No session token was provided');

    async.waterfall([
      cb => Session.findByToken(token).exec(cb),
      (session, cb) => _.isEmpty(session)
        ? cb({ message: 'No matching document', statusCode: 404 })
        : User.findByIdAndPopulate(session.user).exec(cb),
    ], (err, user) => err
      ? res.status(err.statusCode || 500).send(err.message || err)
      : res.json({ user: user.toObject() })
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
      user: _.pick(req.user, ['_id', 'username']),
      token: generateToken()
    }, (err, sess) => {
      if (err) return next(err);
      Object.assign(req.session,
        _.pick(sess, ['user', 'token'])
      );
      next();
    });
  },

  loginSuccess(req, res, next) {
    const { token } = req.session;

    User.findByIdAndPopulate(req.user._id)
      .then(user => res.json({
        token,
        user: user.toObject()
      }))
      .catch(next);
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

  schema(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send(_.flow(getGraphQLSchema, printSchema)(req.body));
  },

  /**
   * COLLECTION & DOCUMENT ROUTES
   */

  loadDocumentsInCollection(req, res, next) {
    const { collectionId } = req.params;
    const { limit = 0 } = req.query;

    Collection.findById(collectionId)
      .then(collection => {
        const Model = ModelGen.getOrGenerateModel(collection);
        const query = Model.find();

        if (limit) {
          query.limit(limit);
        }

        return query.exec();
      })
      .then(invokeMap('toObject'))
      .then(docs => res.json(docs))
      .catch(next);
  },

  upsertCollection(req, res, next) {
    const { collectionId } = req.params;
    const collection = req.body;
    const creator = req.user._id;

    if (collectionId !== 'undefined') {
      // collection already exists
      return Collection.upsert(collection)
        .then(invoke('toObject'))
        .then(coll => res.json(coll))
        .catch(next);
    }

    // TODO: confirm this no longer chappens in absence of GraphQL
    delete collection._id; // defaults to null - mongoose doesn't like that :(
    _.defaults(collection, {
      creator,
      _db: collectionsDbName,
      _collection: `${context.user.username}_${collection.name}`
        .toLowerCase()
        .replace(/\s/g, '')
    });

    const view = {
      name: collection.name,
      type: 'TABLE',
      creator
    };

    Collection.createWithView(collection, view)
      .then(invoke('toObject'))
      .then(coll => res.json(coll))
      .catch(next);
  },

  upsertDocumentInCollection(req, res, next) {
    const { collectionId, documentId } = req.params;
    const { document: newDocument } = req.body;

    Collection.findById(collectionId)
      .then(collection => {
        const Model = ModelGen.getOrGenerateModel(collection);

        return documentId === 'undefined'
          ? Model.create(newDocument)
          : Model.findById(documentId);
      })
      .then(document => {
        if (!document) return Model.create(newDocument);

        // TODO: investigate whether this is still necessary
        // undefined values come out of GraphQL as null
        // don't want to set these on documents
        const denullify = val => _.isArray(val)
          ? _.reject(val, _.isNull)
          : _.isNull(val) ? undefined : val;


        // TODO: diffing algorithm
        const updates = _(newDocument)
          .omit(READONLY_FIELDS)
          .mapValues(denullify)
          .value();

        _.assign(document, updates);

        return new Promise((resolve, reject) => document.save(
          (err, doc) => err ? reject(err) : resolve(doc)
        ));
      })
      .then(invoke('toObject'))
      .then(document => res.json(document))
      .catch(next);
  }
};
