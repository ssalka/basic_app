import * as async from 'async';
import { CommonWrapper, mount } from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'redux-mock-store';
import { browserHistory } from 'lib/client/api/stores/redux';
import {
  systemDbName,
  waitForConnection,
  closeConnection
} from 'lib/server/db';
import * as models from 'lib/server/models';
import * as mocks from 'lib/server/models/mocks';

const middleware = [];
const mockStore = configureStore(middleware);

export function mountWithStore<P = {}, S = {}>(
  element: JSX.Element
): CommonWrapper<P, S> {
  return mount(
    <Provider store={mockStore()}>
      <ConnectedRouter history={browserHistory}>{element}</ConnectedRouter>
    </Provider>
  );
}

const setupOptions = {
  mocks: {}
};

export function setup(options, done) {
  if (systemDbName !== 'test') return done('Not running in test mode');
  _.defaults(options, setupOptions);
  const results = {};
  async.series(
    [
      waitForConnection,
      callback =>
        async.eachOf(
          options.mocks,
          (mockInstances, modelName, cb) => {
            const Model = models[modelName];
            const MockModel = mocks[`Mock${modelName}`];
            if (!Model) {
              return cb(`Model ${modelName} not found`);
            }
            if (!MockModel) {
              return cb(`No mock class found for model ${modelName}`);
            }

            results[modelName] = [];
            async.each(
              mockInstances,
              (mockInstance, _cb) => {
                const mock = new MockModel(mockInstance);
                results[modelName].push(mock);
                Model.create(mock, _cb);
              },
              cb
            );
          },
          callback
        )
    ],
    _.partial(done, _, results)
  );
}

const cleanupOptions = {
  clearDatabase: true
};

export function cleanup(done, options = {}) {
  if (systemDbName !== 'test') return done('Not running in test mode');
  _.defaults(options, cleanupOptions);
  setImmediate(() =>
    async.series(
      [
        cb =>
          async.eachOf(
            models,
            (Model, name, _cb) => {
              if (name === 'default') return _cb();
              Model.remove({}, _cb);
            },
            cb
          ),
        closeConnection
      ],
      done
    )
  );
}
