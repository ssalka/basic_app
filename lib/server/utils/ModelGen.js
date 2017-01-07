const connection = require('../db');
const { Mixed } = require('./types');
const { FIELD_TYPES } = require('lib/common/constants');
const { Schema } = require('mongoose');
const _ = require('lodash');
_.mixin(require('lodash-inflection'));
require('mongoose-schema-extend');

const _defaults = {
  // Consumed by mongoose
  extensions: {
    props: {},
    options: {
      discriminatorKey: '_model',
      toObject: {
        getters: true
      }
    }
  },
  // ModelGen configuration
  settings: {
    BaseSchema: new Schema(
      {}, { timestamps: true }
    ),
    dbName: 'test',
    propTypes: [
      'methods',
      'statics'
    ],
    trackCollection: true
  }
};

class ModelGen {
  constructor(defaults=_defaults) {
    this.defaults = defaults;
    this.dbs = {};
  }

  /**
   * Generates a Mongoose schema given the `fields` property of a Collection document
   *
   * @param {Object} fields
   * @returns {Object}
   */
  getSchema(fields) {
    const typeMap = {
      // TODO: support other types, or remove from FIELD_TYPES if unable to implement
      BOOLEAN: Boolean,
      STRING: String,
      NUMBER: Number,
      DATETIME: Date,
      MIXED: Mixed
    };

    return _.reduce(fields, (schema, field) => {
      const fieldName = _.camelCase(field.name);
      const type = typeMap[field.type] || Mixed;
      const fieldProps = {
        type: field.isArray ? [type] : type,
        required: field.required
      };
      return _.extend(schema, { [fieldName]: type });
    }, {});
  }

  /**
   * Generates a new Mongoose model according to the specifications
   *
   * @param {String} name
   * @param {Object} schema
   * @param {Object} extensions
   * @param {Object} settings
   * @returns {Object}
   */
  generateModel(name='Model', schema={}, extensions={}, settings={}) {
    const { // Unpack extensions & settings, filling in any missing defaults
      extensions: { props, options },
      settings: { BaseSchema, dbName, propTypes, trackCollection }
    } = _.merge({}, this.defaults, { extensions, settings });

    // Check context witin database
    if (!this.isAvailable(dbName, name)) return;
    if (trackCollection) this.trackCollection(dbName, name);

    // Create the schema
    const ModelSchema = BaseSchema.extend(schema, options);

    // Apply plugins & virtuals
    if (props.plugins) {
      props.plugins.forEach(plugin => ModelSchema.plugin(plugin));
    }
    if (props.virtuals) {
      _.forEach(props.virtuals,
        ({getter, setter}, name) => {
          const virtual = ModelSchema.virtual(name);
          if (getter) virtual.get(getter);
          if (setter) virtual.set(setter);
        }
      );
    }

    // Set properties
    _(props).pick(propTypes).forEach((propSet, type) => {
      _.forEach(propSet, (prop, name) => {
        if (ModelSchema[type][name]) return console.warn(`
          ${_.singularize(type)} '${name}' already exists on ModelSchema.${type}
        `);

        ModelSchema[type][name] = prop;
      });
    });

    connection.useDb(dbName);

    return connection.model(name, ModelSchema);
  }

  /**
   * Checks whether a collection with the given name
   * already exists in the database
   *
   * @param {String} dbName
   * @param {String} modelName
   */
  isAvailable(dbName, modelName) {
    const collectionExists = _.includes(this.dbs[dbName], modelName);
    if (collectionExists) console.error(`
      Database ${dbName} already has a ${modelName} collection
    `);
    return !collectionExists;
  }

  /**
   * Tracks a given collection via this.dbs
   *
   * @param {String} dbName
   * @param {String} collection
   */
  trackCollection(dbName, collection) {
    if (!this.dbs[dbName]) this.dbs[dbName] = [];
    this.dbs[dbName].push(collection);
  }


  /**
   * Resets the database map and clears out
   * registered models - used only for testing
   */
  reset() {
    this.dbs = {};
    connection.models = {};
  }
};

module.exports = new ModelGen();
