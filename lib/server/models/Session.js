const { ModelGen, types: { ref } } = require('../utils');

const SessionSchema = {
  token: {
    type: String,
    required: true
  },
  user: ref('User')
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
