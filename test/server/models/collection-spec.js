import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

describe.only("Collection", () => {
  beforeAll(setup);
  afterAll(cleanup);

  it("finds a test collection", done => {
    Collection.findOne()
      .then(collection => {
        expect(collection).not.toBeNull();
        done();
      });
  });
});
