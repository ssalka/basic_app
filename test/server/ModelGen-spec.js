const _ = require('lodash');
const { ModelGen, types: { Mixed } } = require('lib/server/utils');
const MockCollection = require('lib/server/models/mocks/collection');

describe("ModelGen", () => {


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

  describe("#getSchema", () => {

    const { fields } = new MockCollection();

    it("maps the a list of Fields to a mongoose schema", () => {
      expect(ModelGen.getSchema(fields)).toEqual({
        stringField: { type: String },
        numberField: { type: Number },
        mixedField: { type: Mixed },
        unknownField: { type: Mixed }
      });
    });

  });

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

  describe("#modelExists", () => {

    it("returns true if a collection with the given name already exists in the db", () => {
      let result = ModelGen.modelExists(settings.dbName, name);

      expect(result).toBe(false);

      console.info = jest.fn();
      ModelGen.dbs = { test: { TestModel: 'Model' } };
      result = ModelGen.modelExists(settings.dbName, name);

      expect(console.info).toHaveBeenCalled();
      expect(result).toBe(true);
    });

  });

  describe("#trackCollection", () => {

    it("adds the collection being generated to a database map", () => {
      const { dbName } = settings;
      ModelGen.trackCollection(dbName, name, 'Model');

      expect(ModelGen.dbs[dbName]).toEqual({ [name]: 'Model' });
    });

  });

});
