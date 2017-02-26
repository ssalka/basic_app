import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

describe("Collection", () => {
  let collections;

  beforeAll(done => setup({
    mocks: {
      Collection: [{ name: 'Test Collection' }]
    }
  }, (err, results) => {
    if (err) return done(err);
    collections = results.Collection;
    done();
  }));

  afterAll(cleanup);

  it("finds a test collection", done => {
    Collection.findOne().then(collection => {
      expect(collection).not.toBeNull();
      done();
    });
  });
});
