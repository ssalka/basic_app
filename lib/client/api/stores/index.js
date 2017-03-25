import { createConnector } from 'cartiv';
import UserStore from './UserStore';
import createStore from './createStore';

const connect = createConnector(React);

export {
  connect,
  createStore,
  UserStore
};
