const _ = require('lodash');
const { ModelGen, types: { Mixed } } = require('lib/server/utils');

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

    const fields = [
      { name: 'String Field', type: 'STRING' },
      { name: 'Number Field', type: 'NUMBER' },
      { name: 'Mixed Field', type: 'MIXED' },
      { name: 'Unknown Field', type: null }
    ];

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
