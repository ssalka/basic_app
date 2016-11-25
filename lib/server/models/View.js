const { ModelGen, types: { ref } } = require('../utils');

const VIEW_TYPES = [
  'DESKTOP',
  'DASHBOARD',
  'GRAPH',
  'TABLE'
];

const ViewSchema = {
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: VIEW_TYPES,
    required: true
  },
  collections: [ref('Collection')],

  // Metadata
  creator: ref('User', true),
  description: String,
  public: {
    type: Boolean,
    required: true,
    default: false
  },
};

const View = ModelGen.generateModel(
  'View', ViewSchema
);

module.exports = View;
