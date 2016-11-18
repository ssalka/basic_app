const _ = require('lodash');
_.mixin(require('lodash-inflection'));

class ModelGen {
  constructor(conn, defaults) {
    require('mongoose-schema-extend');
    this.conn = conn;
    this.defaults = defaults;
    this.dbs = {};
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
      settings: { BaseSchema, dbName, propTypes, trackCollection }
    } = _.merge({}, this.defaults, { config, settings });

    // Check context witin database
    if (!this.isValidCollection(dbName, name)) return;
    if (trackCollection) this.trackCollection(dbName, name);

    // Create the schema
    const ModelSchema = BaseSchema.extend(schema, options);

    // Apply plugins
    if (props.plugins) {
      props.plugins.forEach(plugin => ModelSchema.plugin(plugin));
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

    return this.conn.useDb(dbName).model(name, ModelSchema);
  }

  /**
   * Checks whether a collection with the given name
   * already exists in the database
   *
   * @param {String} dbName
   * @param {String} modelName
   */
  isValidCollection(dbName, modelName) {
    const collectionExists = _.has(this.dbs[dbName], modelName);
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
};

module.exports = (conn, mongoose) => {
  // BaseSchema config
  const config = {
    props: {},
    options: {
      discriminatorKey: '_model'
    }
  };

  // Consumed by ModelGen
  const settings = {
    BaseSchema: new mongoose.Schema(
      {}, { timestamps: true }
    ),
    dbName: 'test',
    propTypes: [
      'methods',
      'statics'
    ],
    trackCollection: true
  };

  return new ModelGen(conn, {
    config, settings
  });
};
