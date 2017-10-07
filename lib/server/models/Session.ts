import { ModelGen, types } from '../utils';

const { ref } = types;

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

export default Session;
