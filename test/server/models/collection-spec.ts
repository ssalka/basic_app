import * as assert from 'assert';
import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';
import { FIELD_TYPES, RENDER_METHODS } from 'lib/common/constants';
import { Collection as ICollection } from 'lib/client/interfaces';

describe("Collection", () => {
  let collections: ICollection[];

  const fieldTypes: string[] = _.map(FIELD_TYPES.STANDARD, 'key');
  const renderMethods: string[] = _.map(RENDER_METHODS, 'key');

  const testCollection = new MockCollection({
    name: 'Test Collection'
  });

  beforeAll(done => setup({
    mocks: {
      Collection: [testCollection]
    }
  }, (err, results) => {
    if (err) {
      return done(err);
    }
    collections = results.Collection;
    done();
  }));

  afterAll(cleanup);

  it("finds a test collection", done => {
    Collection.findOne((err, collection) => {
      expect(err).toBeNull();
      expect(collection).not.toBeNull();
      expect(collection.name).toEqual(testCollection.name);

      const primitiveFields = collection.toObject().fields.slice(0, -1);
      _.zipWith(primitiveFields, testCollection, ([field, testField], i) => {
        expect(field).toEqual(testField, `field ${i} doesn't match`);
      });
      assert(
        // TODO: add separate assertion for collection fields
        _.every(primitiveFields, _.conforms({
          name: _.isString,
          type: type => _.includes(fieldTypes, type),
          required: _.isBoolean,
          isArray: _.isBoolean,
          renderMethod: method => _.includes(renderMethods, method)
        })),
        "A primitive field doesn't match the Field schema"
      );
      done();
    });
  });
});
