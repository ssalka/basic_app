import * as _ from 'lodash';
import { createTestDocs, removeTestDocs } from 'test/utils';
import { READONLY_FIELDS } from 'lib/common/constants';
import { Collection } from 'lib/server/models';
import { MockCollection, MockUser } from 'lib/server/models/mocks';

describe('Test Utils', () => {
  describe('createTestDocs', () => {
    afterEach(removeTestDocs);

    it('create mongo documents of the given collections', async done => {
      const testDocs: Record<MongoCollection, Record<string, any>> = {
        Collection: [new MockCollection()]
      };

      const createdDocs = await createTestDocs(testDocs).catch(done.fail);
      expect(_.keys(createdDocs)).toEqual(_.keys(testDocs));
      expect(_.compact(createdDocs.Collection).length).toBe(testDocs.Collection.length);

      const collection = await Collection
        .findById(createdDocs.Collection[0]._id)
        .catch(done.fail);

      expect(collection._id).toEqual(createdDocs.Collection[0]._id);

      done();
    });
  });
});
