import { series } from 'async';
import { dbName, waitForConnection } from 'lib/server/db';
import { Collection } from 'lib/server/models';
import { MockCollection } from 'lib/server/models/mocks';

let connected;

export function setup(done) {
  if (dbName !== 'test') return process.exit();
  series([
    cb => connected ? cb() : waitForConnection()
      .then(() => connected = true)
      .then(cb),
    cb => Collection.create(new MockCollection, cb),
  ], done);
}

const cleanupConfig = {
  clearDatabase: true
};

export const cleanup = _.curry((config, done) => {
  setImmediate(() => {
    if (config instanceof Function) {
      done = config; config = {};
    }
    _.defaults(config, cleanupConfig);

    if (config.clearDatabase) {
      Collection.remove({}, done);
    }
  });
});
