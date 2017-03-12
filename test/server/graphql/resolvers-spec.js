import async from 'async';
import { setup, cleanup } from 'test/utils';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';
import getResolvers from 'lib/server/graphql/resolvers';
import { ModelGen } from 'lib/server/utils';

describe("GraphQL Resolvers", () => {
  let collection;
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

    collection = collections[0];
    expect(collection).toBeDefined();

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
      let Model, existingDocument;
      let fieldName, newValue, partialDocument;

      const getNewValue = _.partial(_.get, {
        BOOLEAN: true,
        STRING: 'new string value',
        NUMBER: _.random(0, 50000),
        DATETIME: new Date
      });

      beforeEach(done => {
        const { name, type } = _.sample(collection.fields);
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

        upsert_testUser_testcollection(_, partialDocument).then(updatedDocument => {
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
          cb => upsert_testUser_testcollection(_, partialDocument)
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

        upsert_testUser_testcollection(_, partialDocument).then(document => {
          expect(document[otherField]).not.toBeNull();
          done();
        });
      });

      it("unsets non-null values if the new value is null", done => {
        partialDocument._id = existingDocument._id;
        partialDocument[fieldName] = null;

        upsert_testUser_testcollection(_, partialDocument).then(document => {
          expect(document[fieldName]).toBeUndefined();
          done();
        });
      });
    });
  });
});
