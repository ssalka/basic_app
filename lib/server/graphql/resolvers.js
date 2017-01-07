const { User, Collection, Session, View } = require('../models');
const _ = require('lodash');
const async = require('async');
const { ModelGen } = require('../utils');

const Query = {
  me(root, args, context) {
    const userId = _.get(context, 'user._id');
    return userId ? User.findById(userId) : null;
  },
  user(root, {id, email, username} = {}) {
    let query;

    if (id) {
      // Find by ID
      query = User.findById(id);
    }
    else if (username || email) {
      // OR search on other fields
      const params = _.pickBy({ username, email });
      query = User.findOne({
        $or: _.map(params, (val, key) => ({ [key]: val }))
      });
    }
    else {
      return null;
    }

    return query.exec();
  },
  users(root, {ids = [], limit = 0} = {}) {
    const query = {};

    if (ids.length) {
      query._id = { $in: ids };
    }

    return User.find(query).limit(limit).exec();
  },
  // Find a collection document, then use it
  // to get the actual collection's documents
  getCollection(root, {id}) {
    return Collection.findById(id).populate('creator').then(collection => {
      const { name, fields, creator } = collection;
      const schema = ModelGen.getSchema(fields);
      console.log('--- generate model here ---');
      return [{  body: `IT'S A DOC!!!!!!\n\n${collection}` }];
      // const Model = ModelGen.generateModel(name, schema, {
      //   options: { collection: `${creator.username}_${name}` }
      // }, { dbName: 'user_collections' });
      // console.log(Model.schema.paths);
      // // return Model.find().exec().then(docs => (
      // //   // HACK: stringify documents until schemas can be mapped to GraphQL
      // //   docs.map(doc => ({ body: JSON.stringify(doc) }))
      // // ));
    });

  },
  collections(root, {ids = [], creator, limit = 0} = {}) {
    const query = {};

    if (creator) {
      query.creator = creator;
    }

    if (ids.length) {
      query._id = { $in: ids };
    }

    return Collection.find(query).limit(limit).exec();
  }
};

const Mutation = {
  authenticate(root, {token}) {
    return Session.findByToken(token)
      .populate('user')
      .then(session => session.user)
      .catch(console.error);
  },

  addCollection(root, collection, context) {
    _.defaults(collection, _.pickBy({
      name: 'Things',
      icon: 'blank',
      creator: context.user._id,
      _db: context.user.username,
      _collection: collection.name
        .toLowerCase()
        .replace(/\s/g, '')
    }));

    const view = {
      name: collection.name,
      type: 'TABLE',
      creator: context.user._id
    };

    const collectionPromise = new Promise((resolve, reject) => {
      async.waterfall([
        // Create the collection
        cb => Collection.create(collection, cb),
        // Create a view for the collection
        (coll, cb) => {
          view.collections = [coll._id];
          View.create(view, (err, _view) => cb(err, _view, coll));
        },
        // Save a reference to the view in the collection
        (view, coll, cb) => {
          coll.defaultView = view._id;
          coll.views = [view._id];
          coll.save((err, _coll) => cb(err, _coll));
        },
        // Find the collection's creator
        (coll, cb) => User.findById(coll.creator,
          (err, user) => cb(err, user, coll)
        ),
        // Add the collection to the creator's library
        (user, coll, cb) => {
          user.library.collections.push(coll);
          user.save(err => cb(err, coll));
        }
      ], (err, coll) => err ? reject(err) : resolve(coll));
    });

    return collectionPromise;
  }
};

module.exports = {
  Query, Mutation,
  User: {
    library(user) {
      return {
        collections: Collection.find({ creator: user._id }).exec()
      };
    }
  },
  Collection: {
    creator(collection) {
      return User.findById(collection.creator).exec();
    },
    defaultView(collection) {
      return View.findById(collection.defaultView).exec();
    },
    views(collection) {
      if (!collection.views.length) return [];
      return collection.views.length === 1
        ? [View.findById(collection.views[0]).exec()]
        : View.find({ _id: { $in: collection.views } }).exec();
    },
  }
}
