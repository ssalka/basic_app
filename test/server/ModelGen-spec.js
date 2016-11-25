const _ = require('lodash');
const mongoose = require('mongoose');

describe("ModelGen", () => {

  const { ModelGen } = require('lib/server/utils');

  const name = 'TestModel';

  const schema = {
    field: String
  };

  const extensions = {
    props: {
      methods: {
        findSimilar() {
          const { field } = this;
          return this.model(name).findOne({ field });
        }
      },
      statics: {
        findByField(field) {
          return this.findOne({ field });
        }
      }
    }
  };

  const settings = {
    dbName: 'test'
  };

  const ExpectedModel = ModelGen.generateModel(
    name, schema, extensions, settings
  );

  beforeEach(() => ModelGen.reset());

  describe("#generateModel", () => {

    it("sets the properties on the schema", () => {
      const Model = ModelGen.generateModel(name, schema, extensions, settings);

      const ModelSchema = Model.schema;
      expect(ModelSchema.statics.findByField).toBeInstanceOf(Function);
      expect(ModelSchema.methods.findSimilar).toBeInstanceOf(Function);

      const TestInstance = new Model({ field: 'test value' });
      expect(TestInstance.field).toBe('test value');
    });

  });

  describe("isAvailable", () => {

    it("returns false if a collection with the given name already exists in the db", () => {
      let result = ModelGen.isAvailable(settings.dbName, name);

      expect(result).toBe(true);

      console.error = jest.fn();
      ModelGen.dbs = { test: 'TestModel' };
      result = ModelGen.isAvailable(settings.dbName, name);

      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });

  });

  describe("trackCollection", () => {

    it("adds the collection being generated to a database map", () => {
      const { dbName } = settings;
      ModelGen.trackCollection(dbName, name);

      expect(ModelGen.dbs[dbName]).toBeDefined();
      expect(_.includes(ModelGen.dbs[dbName], name)).toBe(true);
    });

  });

});
