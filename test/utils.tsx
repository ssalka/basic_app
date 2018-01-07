import * as async from 'async';
import { CommonWrapper, mount } from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'redux-mock-store';
import { browserHistory } from 'lib/client/api/store';
import { systemDbName, waitForConnection, closeConnection } from 'lib/server/db';
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
      callback => waitForConnection.then(() => callback(), callback),
      callback =>
        async.eachOf(
          options.mocks,
          (mockInstances, modelName, cb) => {
            const ActualModel = models[modelName];
            if (!ActualModel) return cb(`Model ${modelName} not found`);

            const MatchedModel = mocks[`Mock${modelName}`];
            // prettier-ignore
            if (!MatchedModel) console.warn(`No mock class found for model ${modelName} - using unmodified input object(s)`);

            const MockModel = MatchedModel || ActualModel;

            results[modelName] = [];
            async.each(
              mockInstances,
              (mockInstance, _cb) => {
                const mock = MatchedModel ? new MatchedModel(mockInstance) : mockInstance;
                results[modelName].push(mock);
                ActualModel.create(mock, _cb);
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
