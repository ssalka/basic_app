export const enum MongoCollection {
  Collection = 'Collection',
  Entity = 'Entity',
  EntityEvent = 'EntityEvent',
  Uncategorized = 'Uncategorized'
}

export const FIELD_TYPES = {
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
};

import icons from './icons';

export const ICONS = icons;

export const READONLY_FIELDS = [
  '_id',
  '_model',
  '__v',
  'createdAt',
  'updatedAt',
  '__typename'
];

export const RENDER_METHODS = [
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
];

export const VIEW_TYPES = ['DESKTOP', 'DASHBOARD', 'GRAPH', 'TABLE'];
