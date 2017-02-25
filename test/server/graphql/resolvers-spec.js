import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';
import getResolvers from 'lib/server/graphql/resolvers';

describe("GraphQL Resolvers", () => {
  let resolvers, collection = {};

  beforeAll(setup);
  afterAll(cleanup);

  beforeEach(done => {
    Collection.findOne()
      .then(coll => collection = coll)
      .then(() => resolvers = getResolvers([collection]))
      .then(done);
  });

  describe("getResolvers", () => {
    it("returns the resolvers", () => {
      const { Query, Mutation, User, Collection } = resolvers;
      _.forEach({ Query, Mutation, User, Collection }, resolver => {
        expect(resolver).toBeInstanceOf(Object);
        _(resolver)
          .map(expect)
          .invokeMap('toBeInstanceOf', Function);
      });
    });
  });

  describe("Mutation", () => {

    let Mutation;

    beforeEach(() => ({ Mutation } = resolvers));

    describe("authenticate", () => {

    });

    describe("upsertCollection", () => {

    });

    describe(`upsert_${collection._collection}`, () => {

    });
  });
});
