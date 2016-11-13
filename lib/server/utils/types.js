const { Types } = require('mongoose').Schema;

// export types
Object.assign(exports, Types);

exports.ref = (collection, required = false) => ({
  type: Types.ObjectId,
  ref: collection,
  required
})
