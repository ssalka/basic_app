import { series } from 'async';
import { dbName, waitForConnection, closeConnection } from 'lib/server/db';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

export function setup(done) {
  if (dbName === 'test') series([
    waitForConnection,
    cb => Collection.create(new MockCollection, cb)
  ], done);
}

const cleanupConfig = {
  clearDatabase: true
};

export function cleanup(done, config = {}) {
  _.defaults(config, cleanupConfig);
  setImmediate(() => {
    if (config.clearDatabase) series([
      cb => Collection.remove({}, cb),
      closeConnection
    ], done);
  });
}
