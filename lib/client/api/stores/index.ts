import * as React from 'react';
import { createConnector } from 'cartiv';
import createStore from './createStore';
import getCollectionStore from './getCollectionStore';

const connect = createConnector(React);

export { connect, createStore, getCollectionStore };
