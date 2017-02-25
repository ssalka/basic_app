import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';
import getResolvers from 'lib/server/graphql/resolvers';

describe("GraphQL Resolvers", () => {
  let resolvers, collections;
  let Query, Mutation, User, _Collection;

  beforeAll(done => setup({
    mocks: {
      Collection: [{ name: 'Test Collection' }]
    }
  }, (err, mocks) => {
    if (err) return done(err);
    collections = mocks.Collection;
    resolvers = {
      Query,
      Mutation,
      User,
      Collection: _Collection
    } = getResolvers(collections);
    done();
  }));

  afterAll(cleanup);

  describe("getResolvers", () => {
    it("returns the resolvers", () => {
      _.forEach({ Query, Mutation, User, _Collection }, resolver => {
        expect(resolver).toBeInstanceOf(Object);

        _(resolver)
          .map(expect)
          .invokeMap('toBeInstanceOf', Function);
      });
    });
  });

  describe("Mutation", () => {
    let authenticate, upsertCollection, upsert_testUser_testcollection;

    beforeEach(() => ({
      authenticate,
      upsertCollection,
      upsert_testUser_testcollection
    } = Mutation));

    describe("authenticate", () => {
      it("finds a user by session token");
    });

    describe("upsertCollection", () => {
      it("updates an existing collection");
      it("creates a new collection if it doesn't already exist");
      it("adds a new view document if creating collection");
    });

    describe("upsert_testUser_testcollection", () => {
      it("updates a document in a user collection");
      it("doesn't set null as a value unless given as a GraphQL argument");
    });
  });
});
