module.exports = {
  FIELD_TYPES: {
    STANDARD: [
      {
        key: 'BOOLEAN',
        name: 'Boolean',
        primitiveType: Boolean
      },
      {
        key: 'STRING',
        name: 'String',
        primitiveType: String
      },
      {
        key: 'NUMBER',
        name: 'Number',
        primitiveType: Number
      },
      {
        key: 'DATETIME',
        name: 'Date/Time',
        primitiveType: Date
      }
    ],
    UNSUPPORTED: [
      {
        key: 'FUNCTION',
        name: 'Function',
        primitiveType: Function
      },
      {
        key: 'ARRAY',
        name: 'Array',
        primitiveType: Array
      },
      {
        key: 'OBJECT',
        name: 'Object',
        primitiveType: Object
      },
      {
        key: 'MIXED',
        name: 'Mixed'
      },
      {
        key: 'COLLECTION',
        name: 'Collection'
      }
    ]
  },
  ICONS: require('./icons.json'),
  READONLY_FIELDS: [
    '_id',
    '_model',
    '__v',
    'createdAt',
    'updatedAt'
  ]
};
