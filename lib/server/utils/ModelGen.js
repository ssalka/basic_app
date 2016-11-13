const { forEach, map, has, pick, isEmpty, defaultsDeep } = require('lodash');
const db = require('../db');
const BaseModelSchema = require('../models/BaseModel');
require('mongoose-schema-extend');

const defaults = {
  config: {
    props: {},
    options: {
      discriminatorKey: '_model'
    }
  },
  settings: {
    BaseSchema: BaseModelSchema,
    dbName: 'test',
    propsToSet: [
      'plugins',
      'methods',
      'statics',
      'queries'
    ],
    trackCollection: true
  }
};

class ModelGen {
  constructor(defaults) {
    this.defaults = defaults;
    this.dbs = {};
  }

  /**
   * An alias for ModelGen.generateModel
   * Usage: new Model('ModelName', ModelSchema)
   *
   * FIXME: This doesn't work yet (binding/this issue)
   *
   * @returns {Class} Model
   */
  get Model() {
    const self = this;
    return class Model {
      constructor(...args) {
        self.generateModel(...args);
      }
    };
  }

  /**
   * Generates a new Mongoose model according to the specifications
   *
   * @param {String} name
   * @param {Object} schema
   * @param {Object} config
   * @param {Object} settings
   * @returns {Object}
   */
  generateModel(name='Model', schema={}, config={}, settings={}) {
    const { // Unpack config & settings, filling in any missing defaults
      config: { props, options },
      settings: { BaseSchema, dbName, propsToSet, trackCollection }
    } = this.assignDefaults({ config, settings });

    // Check context witin database
    if (!this.isValidCollection(dbName, name)) return;
    if (trackCollection) this.trackCollection(dbName, name);

    // Create schema and set properties
    const ModelSchema = BaseSchema.extend(schema, options);
    const setPropsOnSchema = this.setPropsOnSchema(ModelSchema);
    forEach(props, setPropsOnSchema);

    return db.useDb(dbName).model(name, ModelSchema);
  }

  /**
   * Injects schema into a setProperties function, which
   * calls setProps on each (props, type) pair of props
   *
   * @param {Object} schema
   * @returns {Function} setProperties
   */
  setPropsOnSchema(schema) {
    const self = this;
    return function setProperties(props, type) {
      type = type.replace('queries', 'query');
      forEach(props, self.setPropsIteratee(schema, type));
    };
  }

  /**
   * Injects schema and type into a setProperty function, which
   * applies a single property of the given type to the schema
   *
   * @param {Object} schema
   * @param {String} type
   * @returns {Function} setProperty
   */
  setPropsIteratee(schema, type) {
    const setPropertyOnSchema = this.setter(type, schema);
    return function setProperty(prop, name) {
      if (type !== 'plugins' && schema[type][name]) return console.warn(`
        '${name}' already exists on schema.${type}
      `);
      setPropertyOnSchema(prop, name);
    };
  }

  /**
   * Returns a function that - depending on the value of the
   * type argument - either applies a plugin or sets a property
   *
   * @param {String} type
   * @param {Object} schema
   * @returns {Function}
   */
  setter(type, schema) {
    return type === 'plugins'
      ? (plugin) => schema.plugin(plugin)
      : (prop, name) => schema[type][name] = prop;
  }


  /**
   * Checks whether a collection with the given name
   * already exists in the database
   *
   * @param {String} dbName
   * @param {String} modelName
   */
  isValidCollection(dbName, modelName) {
    const collectionExists = has(this.dbs[dbName], modelName);
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
   * Fill in defaults, but prioritize objects passed in
   *
   * @param {[Object]} objects
   * @returns {[Object]}
   */
  assignDefaults(objects) {
    const { defaults } = this;
    return map(objects,
      (obj, name) => {
        const output = pick(defaults, name);
        return isEmpty(obj) ? output
          : defaultsDeep({ [name]: obj }, output);
      })
      .reduce(Object.assign, {});
  }
};

module.exports = new ModelGen(defaults);
