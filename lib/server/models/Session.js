const { ModelGen } = require('../db');
const { ObjectId } = require('../utils/types');

const SessionSchema = {
  token: {
    type: String,
    required: true
  },
  user: {
    _id: ObjectId,
    username: String
  }
};

const statics = {
  findByToken(token) {
    return this.findOne({ token });
  }
};

const Session = ModelGen.generateModel(
  'Session', SessionSchema, {
    props: { statics }
  }
);

module.exports = Session;
