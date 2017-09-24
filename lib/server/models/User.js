const _ = require('lodash');
const passportLocalMongoose = require('passport-local-mongoose');
const { ModelGen, types: { ref } } = require('../utils');
const { mapToKeyValueArray } = require('lib/common/helpers');

const UserSchema = {
  username: {
    type: String,
    required: true,
    validator(str) {
      return /^[a-zA-Z0-9_]*$/.test(str);
    }
  },
  email: {
    type: String,
    validator(str) {
      return /.+@.+\..+/i.test(str);
    }
  },
  name: {
    first: String,
    last: String
  },
  salt: String,
  hash: String,
  library: {
    views: [ref('View')],
    collections: [ref('Collection')]
  }
};

const plugins = [passportLocalMongoose];

const statics = {
  search({ _id, ids, username, email, limit = 0 }) {
    let query;

    if (_id) {
      query = this.findById(_id);
    }
    else if (ids) {
      query = this.find({
        _id: { $in: ids }
      });
    }
    else if (username || email) {
      query = this.find({
        $or: mapToKeyValueArray({
          username, email
        })
      }).limit(limit);
    }
    else {
      query = limit === 1
        ? this.findOne()
        : this.find().limit(limit);
    }

    return query;
  },
  findByIdAndPopulate(_id) {
    return this.findById(_id)
      .populate('library.collections')
      .populate('library.views');
  }
};

const User = ModelGen.generateModel(
  'User', UserSchema, {
    props: { plugins, statics }
  }
);

module.exports = User;
