import { series } from 'async';
import { dbName, waitForConnection } from 'lib/server/db';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

export function setup(done) {
  if (dbName !== 'test') return process.exit();

  insertTestCollection({}, done);
}

function insertTestCollection(collection, done) {
  series([
    waitForConnection,
    cb => Collection.create(new MockCollection(collection), cb)
  ], done);
}

const cleanupConfig = {
  clearDatabase: true
};

export const cleanup = _.curry(
  (config, done) => {
    if (config instanceof Function) {
      done = config; config = {};
    }
    _.defaults(config, cleanupConfig);

    if (config.clearDatabase) {
      Collection.remove({}, done);
    }
  }
);
