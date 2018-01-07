import * as asyncLib from 'async';
import { CommonWrapper, mount } from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'redux-mock-store';
import { browserHistory } from 'lib/client/api/store';
import { systemDbName, waitForConnection, closeConnection } from 'lib/server/db';
import * as models from 'lib/server/models';
import * as mockModels from 'lib/server/models/mocks';

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

async function createMockInstances(mockInstances, modelName) {
  const ActualModel = models[modelName];
  if (!ActualModel) throw new Error(`Model ${modelName} not found`);

  const MatchedModel = mockModels[`Mock${modelName}`];
  // prettier-ignore
  if (!MatchedModel) console.warn(`No mock class found for model ${modelName} - using unmodified input object(s)`);

  const MockModel = MatchedModel || ActualModel;

  return Promise.all(
    mockInstances
      .map(mock => (MatchedModel ? new MatchedModel(mock) : mock))
      .map(async mock => ActualModel.create(mock).catch(Promise.reject))
  );
}

export async function setup({ mocks = {} }) {
  if (systemDbName !== 'test') return done('Not running in test mode');

  await waitForConnection();

  return await Promise.all(_.flatMap(mocks, createMockInstances)).catch(Promise.reject);
}

const cleanupOptions = {
  clearDatabase: true
};

export function cleanup(done, options = {}) {
  if (systemDbName !== 'test') return done('Not running in test mode');
  _.defaults(options, cleanupOptions);
  setImmediate(() =>
    asyncLib.series(
      [
        cb =>
          asyncLib.eachOf(
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
