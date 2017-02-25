import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

describe.only("Collection", () => {
  beforeAll(setup);
  afterAll(done => setImmediate(
    () => cleanup(done)
  ));

  it("finds a test collection", done => {
    Collection.findOne()
      .then(collection => {
        expect(collection).not.toBeNull();
        done();
      });
  });
});
