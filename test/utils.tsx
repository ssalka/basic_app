import { CommonWrapper, mount } from 'enzyme';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'redux-mock-store';
import { browserHistory } from 'lib/client/api/store';
import { systemDbName, waitForConnection } from 'lib/server/db';
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

export async function cleanup() {
  if (systemDbName !== 'test') throw new Error('Not running in test mode');

  // REVIEW: why is setImmediate necessary?
  setImmediate(async () => {
    await Promise.all(_.map(models, async Model => Model.remove({})));

    return mongoose.disconnect();
  });
}
