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

function throwError(err): never {
  throw new Error(err);
}

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
  if (!ActualModel) throwError(`Model ${modelName} not found`);

  const MatchedModel = mockModels[`Mock${modelName}`];
  if (!MatchedModel) console.info(`No mock class found for model ${modelName} - using unmodified input object(s)`);

  const MockModel = MatchedModel || ActualModel;

  return Promise.all(
    mockInstances
      .map(mock => (MatchedModel ? new MatchedModel(mock) : mock))
      .map(mock => ActualModel.create(mock).catch(throwError))
  );
}

export async function createTestDocs(mocks = {}) {
  if (systemDbName !== 'test') throwError('Not running in test mode');

  await waitForConnection();

  const results = await Promise.all(_.flatMap(mocks, createMockInstances)).catch(
    throwError
  );

  // TODO: figure out how to get rid of [0], _.flatten
  return _(results)
    .groupBy('[0].constructor.modelName')
    .mapValues(_.flatten)
    .value();
}

export async function removeTestDocs(done) {
  if (systemDbName !== 'test') throwError('Not running in test mode');

  await Promise.all(_.map(models, async Model => Model.remove({})));

  await mongoose.disconnect();

  done();
}
