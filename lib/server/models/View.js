const { ModelGen, types: { ref } } = require('../utils');

const VIEW_TYPES = [
  'DESKTOP',
  'DASHBOARD',
  'GRAPH',
  'SIMPLE',
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

const statics = {
  findByCollection(collection) {
    if (!collection.views.length) return [];
    return collection.views.length === 1
      ? [this.findById(collection.views[0])]
      : this.find({ _id: { $in: collection.views } });
  }
}

const View = ModelGen.generateModel(
  'View', ViewSchema, {
    props: { statics }
  }
);

module.exports = View;
