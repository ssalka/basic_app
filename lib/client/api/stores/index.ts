import * as React from 'react';
import { createConnector } from 'cartiv';
import CollectionStore from './CollectionStore';
import UserStore from './UserStore';
import createStore from './createStore';
import getCollectionStore from './getCollectionStore';

const connect = createConnector(React);

export { connect, createStore, getCollectionStore, CollectionStore, UserStore };
