module.exports = {
  FIELD_TYPES: {
    STANDARD: [
      {
        key: 'BOOLEAN',
        name: 'Boolean',
        primitiveType: Boolean,
        icon: 'power'
      },
      {
        key: 'STRING',
        name: 'String',
        primitiveType: String,
        icon: 'font'
      },
      {
        key: 'NUMBER',
        name: 'Number',
        primitiveType: Number,
        icon: 'numerical'
      },
      {
        key: 'DATETIME',
        name: 'Date/Time',
        primitiveType: Date,
        icon: 'time'
      }
    ],
    COLLECTION: 'COLLECTION',
    UNSUPPORTED: [
      {
        key: 'FUNCTION',
        name: 'Function',
        primitiveType: Function
      },
      {
        key: 'OBJECT',
        name: 'Object',
        primitiveType: Object
      },
      {
        key: 'ANY',
        name: 'Any'
      }
    ]
  },
  ICONS: require('./icons.json'),
  READONLY_FIELDS: [
    '_id',
    '_model',
    '__v',
    'createdAt',
    'updatedAt',
    '__typename'
  ],
  RENDER_METHODS: [
    {
      key: 'PLAIN_TEXT',
      name: 'Plain Text',
      targetProp: 'children',
      inputType: 'MIXED'
    },
    {
      key: 'RATING',
      name: 'Rating',
      targetProp: 'initialRate',
      inputType: 'NUMBER'
    }
  ]
};
