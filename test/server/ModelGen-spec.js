const _ = require('lodash');

fdescribe("ModelGen", () => {

  let { ModelGen } = require('lib/server/db');

  let name = 'TestModel';

  let schema = {
    field: String
  };

  let extensions = {
    props: {
      methods: {
        findByField() {
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

  let settings = {
    dbName: 'test'
  };

  const ExpectedModel = ModelGen.generateModel(
    name, schema, extensions, settings
  );

  beforeEach(() => {
    ({ ModelGen } = require('lib/server/db'));
    ModelGen.conn.models = {};
    ModelGen.dbs = {};
  });

  describe("#generateModel", () => {

    it("sets the properties on the schema", () => {
      ModelGen.conn.model = jest.fn(ModelGen.conn.model);

      const Model = ModelGen.generateModel(name, schema, extensions, settings);

      const ModelSchema = Model.schema;
      expect(ModelSchema.statics.findByField).toBeDefined();
      expect(ModelSchema.statics.findByField).toBeInstanceOf(Function);
    });

    it("registers the model with the database", () => {
      const Model = ModelGen.generateModel(name, schema, extensions, settings);

      expect(ModelGen.conn.models.TestModel).toEqual(Model);
      expect(Model.toString()).toEqual(ExpectedModel.toString());
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
