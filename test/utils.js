import async from 'async';
import { dbName, waitForConnection, closeConnection } from 'lib/server/db';
import * as models from 'lib/server/models';
import * as mocks from 'lib/server/models/mocks';

const setupOptions = {
  mocks: {}
};

export function setup(options, done) {
  if (dbName !== 'test') return done('Not running in test mode');
  _.defaults(options, setupOptions);
  const results = {};
  async.series([
    waitForConnection,
    callback => async.eachOf(options.mocks, (mockInstances, modelName, cb) => {
      const Model = models[modelName];
      const MockModel = mocks[`Mock${modelName}`];
      if (!Model) {
        return cb(`Model ${modelName} not found`);
      }
      if (!MockModel) {
        return cb(`No mock class found for model ${modelName}`);
      }

      results[modelName] = [];
      async.each(mockInstances, (mockInstance, _cb) => {
        const mock = new MockModel(mockInstance);
        results[modelName].push(mock);
        Model.create(mock, _cb);
      }, cb);
    }, callback)
  ], _.partial(done, _, results));
}

const cleanupOptions = {
  clearDatabase: true
};

export function cleanup(done, options = {}) {
  if (dbName !== 'test') return done('Not running in test mode');
  _.defaults(options, cleanupOptions);
  setImmediate(() => async.series([
    cb => async.eachOf(models, (Model, name, _cb) => {
      if (name === 'default') return _cb();
      Model.remove({}, _cb);
    }, cb),
    closeConnection
  ], done));
}
