const { connection, connections, systemDbName, collectionsDbName } = require('../db');
const { Mixed, ref } = require('./types');
const { FIELD_TYPES, COLLECTION } = require('lib/common/constants');
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
        getters: true,
        virtuals: true
      }
    }
  },
  // ModelGen configuration
  settings: {
    BaseSchema: new Schema(
      {}, { timestamps: true }
    ),
    dbName: systemDbName,
    propTypes: [
      'methods',
      'statics'
    ]
  }
};

const types = FIELD_TYPES.STANDARD.reduce(
  (typeMap, { key, primitiveType }) => _.set(typeMap, key, primitiveType),
  {}
);

class ModelGen {
  constructor(defaults=_defaults) {
    this.defaults = defaults;
    this.dbs = {};
  }

  /**
   * Returns a cached model, or null if it does not exist
   *
   * @param {String} db
   * @param {String} model
   * @returns {Mixed}
   */
  getModel(db, model) {
    return _.get(this.dbs[db], model, null);
  }

  /**
   * Checks for a cached model when given a collection document.
   * Calls generateModel if no model is found
   *
   * @param {Object} collection
   * @returns {Object}
   */
  getOrGenerateModel(collection) {
    const { name, fields, creator, _collection } = collection;
    const schema = this.getSchema(fields);
    return this.getModel(collectionsDbName, _collection) || (
      this.generateModel(name, schema,
        { options: { collection: _collection } },
        { dbName: collectionsDbName  }
      )
    );
  }

  /**
   * Generates a Mongoose schema given the `fields` property of a Collection document
   *
   * @param {Object} fields
   * @returns {Object}
   */
  getSchema(fields) {
    return _.reduce(fields, (schema, field) => {
      const fieldName = _.camelCase(field.name);
      let fieldProps;

      if (field.type === FIELD_TYPES.COLLECTION) {
        const modelName = _.startCase(field.name).replace(/ /g, '');
        const modelRef = ref(modelName, field.required);
        fieldProps = field.isArray ? [modelRef] : modelRef;
      }
      else {
        const type = types[field.type] || Mixed;
        fieldProps = {
          type: field.isArray ? [type] : type,
          required: field.required
        };
      }

      return _.extend(schema, { [fieldName]: fieldProps });
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
      settings: { BaseSchema, dbName, propTypes }
    } = _.merge({}, this.defaults, { extensions, settings });

    // Check for cached model
    if (this.modelExists(dbName, name)) return this.dbs[dbName][name];

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

    const conn = dbName === systemDbName ? connections.app : connections.collections;
    const Model = conn.model(name, ModelSchema);

    this.trackCollection(dbName, name, Model);

    return Model;
  }

  /**
   * Checks whether a collection with the given name
   * already exists in the database
   *
   * @param {String} dbName
   * @param {String} modelName
   */
  modelExists(dbName, modelName) {
    const modelExists = _.includes(_.keys(this.dbs[dbName]), modelName);
    if (modelExists) console.info([
      `Model \`${modelName}\` already has a collection in database ${dbName}.`,
      'Returning model for registered collection'
    ].join(' '));
    return modelExists;
  }

  /**
   * Tracks a given collection via this.dbs
   *
   * @param {String} dbName
   * @param {String} collection
   */
  trackCollection(dbName, modelName, Model) {
    if (!this.dbs[dbName]) this.dbs[dbName] = {};
    this.dbs[dbName][modelName] = Model;
  }

  /**
   * Resets the database map and clears out
   * registered models - used only for testing
   */
  reset() {
    this.dbs = {};
    connections.app.models = {};
    connections.collections.models = {};
  }
};

module.exports = new ModelGen();
