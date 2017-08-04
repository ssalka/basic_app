import * as assert from 'assert';
import * as async from 'async';
import { setup, cleanup } from 'test/utils';
import { Collection as ICollection, User as IUser, Field } from 'lib/client/interfaces';
import { Collection } from 'lib/server/models';
import { MockCollection, MockUser } from 'lib/server/models/mocks';
import getResolvers = require('lib/server/graphql/resolvers');
import { ModelGen } from 'lib/server/utils';

interface IResolverContext {
  user?: IUser;
}

type Resolver = (root: any, query: Record<string, any>, context: IResolverContext) => Promise<IUser>;

type ResolverMap = Record<string, Resolver>;

interface IResolvers {
  Query: ResolverMap;
  Mutation: ResolverMap;
}

describe("GraphQL Resolvers", () => {
  let collection: ICollection;
  let resolvers: IResolvers;
  let collections: ICollection[];
  let Query: ResolverMap;
  let Mutation: ResolverMap;
  let User: ResolverMap;
  let _Collection: ResolverMap;

  let user: IUser;
  let context: IResolverContext;

  beforeAll(done => setup({
    mocks: {
      Collection: [{
        name: 'Test Collection'
      }]
    }
  }, (err, mocks) => {
    if (err) {
      assert.ifError(err);
    }

    collections = mocks.Collection;

    resolvers = {
      Query,
      Mutation,
      User,
      Collection: _Collection
    } = getResolvers(collections);

    expect(collections[0]).toBeDefined();
    collection = _.omit(collections[0], '_collection_unique');

    user = new MockUser({ _id: collection.creator });
    context = { user };

    done();
  }));

  afterAll(cleanup);

  describe("getResolvers", () => {
    it("returns the resolvers", () => {
      _.forEach({ Query, Mutation, User, _Collection }, resolver => {
        expect(resolver).toBeDefined();
        expect(resolver).toBeInstanceOf(Object);

        _(resolver)
          .map(expect)
          .invokeMap('toBeInstanceOf', Function);
      });
    });
  });

  describe("Mutation", () => {
    let authenticate;
    let upsertCollection;
    let upsert_test_user_testcollection;

    beforeEach(() => ({
      authenticate,
      upsertCollection,
      upsert_test_user_testcollection
    } = Mutation));

    describe("authenticate", () => {
      it("finds a user by session token");
    });

    describe("upsertCollection", () => {
      let newCollection: ICollection;

      beforeEach(() => newCollection = new MockCollection());

      afterEach(done => Collection.remove({ _id: newCollection._id }, done));

      it("updates an existing collection", done => {
        const updatedCollection = _.defaults({ name: 'New Collection Name' }, collection);

        Collection.upsert = jest.fn(coll => Promise.resolve(coll));

        upsertCollection(_, updatedCollection, context)
          .then(coll => {
            expect(Collection.upsert).toHaveBeenCalledWith(updatedCollection);
            done();
          })
          .catch(assert.ifError);
      });

      it("creates a new collection if one doesn't already exist", () => {
        const collectionWithoutId = _.omit(collection, '_id');
        const { username } = user;
        const collectionName = collection.name.replace(/\s/g, '').toLowerCase();
        Collection.createWithView = jest.fn((coll, view) => Promise.resolve(coll));

        upsertCollection(_, collectionWithoutId, context);

        expect(Collection.createWithView).toHaveBeenCalledWith({
          ...collectionWithoutId,
          _db: 'test_collections',
          _collection: `${username}_${collectionName}`
        }, {
          name: collection.name,
          type: 'TABLE',
          creator: context.user._id
        });
      });
    });

    describe("upsert_test_user_testcollection", () => {
      let Model; // TODO: get Mongoose types
      let existingDocument: Record<string, any>;
      let fieldName: string;
      let newValue: any;
      let partialDocument: Record<string, any>;

      const getNewValue: (type: string) => boolean | string | number | Date = _.partial(_.get, {
        BOOLEAN: true,
        STRING: 'new string value',
        NUMBER: _.random(0, 50000),
        DATETIME: new Date()
      });

      beforeEach(done => {
        const { name, type }: Field = _.sample(collection.fields);
        fieldName = _.camelCase(name);
        newValue = getNewValue(type);
        partialDocument = {
          [fieldName]: newValue
        };

        Model = ModelGen.getOrGenerateModel(collection);
        Model.create({ [fieldName]: getNewValue(type) }, (err, instance) => {
          existingDocument = instance;
          done(err);
        });
      });

      it("updates a document in a user collection", done => {
        partialDocument._id = existingDocument._id;

        upsert_test_user_testcollection(_, partialDocument).then(updatedDocument => {
          expect(updatedDocument).not.toBeNull();
          expect(updatedDocument[fieldName]).toEqual(newValue);

          Model.findById(existingDocument._id).then(document => {
            expect(document).not.toBeNull();
            expect(document[fieldName]).toEqual(updatedDocument[fieldName]);
            done();
          });
        });
      });

      it("creates a new document in the collection if no _id is given", done => {
        expect(partialDocument._id).toBeUndefined();
        async.waterfall([
          cb => upsert_test_user_testcollection(_, partialDocument)
            .then(document => cb(null, document))
            .catch(cb),
          (document, cb) => Model.findById(document._id)
            .then(doc => cb(null, doc, document))
            .catch(cb),
          (doc, document, cb) => {
            cb();
            expect(doc).toEqual(document);
          }
        ], done);
      });

      it("doesn't set null values", done => {
        const { name: otherField } = _(collection.fields).map('name').sample();
        partialDocument[otherField] = null;

        upsert_test_user_testcollection(_, partialDocument).then(document => {
          expect(document[otherField]).not.toBeNull();
          done();
        });
      });

      it("unsets non-null values if the new value is null", done => {
        partialDocument._id = existingDocument._id;
        partialDocument[fieldName] = null;

        upsert_test_user_testcollection(_, partialDocument).then(document => {
          expect(document[fieldName]).toBeUndefined();
          done();
        });
      });
    });
  });
});
