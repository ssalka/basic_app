import * as lodash from 'lodash';
import * as inflection from 'lodash-inflection';
import { Schema } from 'mongoose';

import { FIELD_TYPES } from 'lib/common/constants';
import { connections, systemDbName, collectionsDbName } from '../db';
import { Mixed, ref } from './types';

const _: any = lodash.mixin(inflection);

const _defaults = {
  // Consumed by mongoose
  extensions: {
    props: {},
    options: {
      discriminatorKey: '_model',
      timestamps: true,
      toObject: {
        getters: true,
        virtuals: true
      }
    }
  },
  // ModelGen configuration
  settings: {
    dbName: systemDbName,
    propTypes: ['methods', 'statics']
  }
};

const types = FIELD_TYPES.STANDARD.reduce(
  (typeMap, { key, primitiveType }) => _.set(typeMap, key, primitiveType),
  {}
);

class ModelGen {
  dbs: Record<string, Record<string, any>>;
  constructor(public defaults = _defaults) {
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

    return (
      this.getModel(collectionsDbName, _collection) ||
      this.generateModel(
        name,
        schema,
        { options: { collection: _collection } },
        { dbName: collectionsDbName }
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
    return _.reduce(
      fields,
      (schema, field: any) => {
        const fieldName = _.camelCase(field.name);
        let fieldProps;

        if (field.type === FIELD_TYPES.COLLECTION) {
          const modelName = _.startCase(field.name).replace(/ /g, '');
          const modelRef = ref(modelName, field.required);
          fieldProps = field.isArray ? [modelRef] : modelRef;
        } else {
          const type = types[field.type] || Mixed;
          fieldProps = {
            type: field.isArray ? [type] : type,
            required: field.required
          };
        }

        return _.extend(schema, { [fieldName]: fieldProps });
      },
      {}
    );
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
  generateModel(name = 'Model', schema = {}, extensions = {}, settings = {}) {
    const {
      // Unpack extensions & settings, filling in any missing defaults
      extensions: { props, options },
      settings: { dbName }
    }: any = _.merge({}, this.defaults, { extensions, settings });

    // Check for cached model
    if (this.modelExists(dbName, name)) return this.dbs[dbName][name];

    // Create the schema
    const ModelSchema = new Schema(schema, options);

    // Apply plugins & virtuals
    if (props.plugins) {
      props.plugins.forEach(plugin => ModelSchema.plugin(plugin));
    }
    if (props.virtuals) {
      _.forEach(props.virtuals, ({ getter, setter }, virtualName) => {
        const virtual = ModelSchema.virtual(virtualName);
        if (getter) virtual.get(getter);
        if (setter) virtual.set(setter);
      });
    }

    this.setValidatedSchemaProps(ModelSchema, props);

    const conn = dbName === systemDbName ? connections.app : connections.collections;
    const Model = conn.model(name, ModelSchema);

    this.trackCollection(dbName, name, Model);

    return Model;
  }

  extendModel(Base, { name, schema = {}, statics = {}, methods = {}, options = {} }) {
    const ModelSchema = new Schema(schema, options);

    // TODO: make this a pure function
    this.setValidatedSchemaProps(ModelSchema, { statics, methods });

    return Base.discriminator(name, ModelSchema);
  }

  setValidatedSchemaProps(schema, { statics, methods }) {
    _({ statics, methods })
      .omitBy(_.isEmpty)
      .forEach((propSet, type) =>
        _.forEach(propSet, (prop, name) => {
          if (schema[type][name]) {
            return console.warn(
              `${_.singularize(type)} '${name}' already exists on ModelSchema.${type}`
            );
          }

          schema[type][name] = prop;
        })
      );
  }

  /**
   * Checks whether a collection with the given name
   * already exists in the database
   *
   * @param {String} dbName
   * @param {String} modelName
   */
  modelExists(dbName, modelName) {
    const modelExists = _.keys(this.dbs[dbName]).includes(modelName);

    if (modelExists) {
      console.info(
        [
          `Model \`${modelName}\` already has a collection in database ${dbName}.`,
          'Returning model for registered collection'
        ].join(' ')
      );
    }

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
    (connections.app as any).models = {};
    (connections.collections as any).models = {};
  }
}

export default new ModelGen();
