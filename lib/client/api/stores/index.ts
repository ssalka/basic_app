declare const React;
import { createConnector } from 'cartiv';
import CollectionStore from './CollectionStore';
import UserStore from './UserStore';
import createStore from './createStore';

const connect = createConnector(React);

export {
  connect,
  createStore,
  CollectionStore,
  UserStore
};
