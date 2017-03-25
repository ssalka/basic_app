import { createStore } from 'cartiv';
import api from '../';

const defaultConfig = {
  initialState: {},
  logUpdates: false
};

export default (config, methods) => {
  const { name, initialState, logUpdates } = _.defaults(config, defaultConfig);
  const storeConfig = {
    api, name,
    actions: _.keys(methods)
  };

  return createStore(storeConfig, {
    ...methods,
    getInitialState() {
      return initialState || {};
    },
    storeDidUpdate(prevState) {
      if (logUpdates) {
        console.info(`${name} store was updated:`, _.pickBy(
          this.state, (val, key) => !_.isEqual(val, prevState[key])
        ));
      }
    }
  });
};
