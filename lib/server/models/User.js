const passportLocalMongoose = require('passport-local-mongoose');
const { ModelGen, types: { ref } } = require('../utils');

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

const User = ModelGen.generateModel(
  'User', UserSchema, {
    props: { plugins }
  }
);

module.exports = User;
