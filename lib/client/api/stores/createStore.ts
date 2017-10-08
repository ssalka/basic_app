declare const _;
import { createStore } from 'cartiv';
import api from '../';

interface IStoreConfig {
  api: typeof api;
  name: string;
  actions: string[];
}

const defaultConfig = {
  initialState: {},
  logUpdates: false
};

export default (config, methods) => {
  const { name, initialState, logUpdates } = _.defaults(config, defaultConfig);
  const storeConfig: IStoreConfig = {
    api,
    name,
    actions: _.keys(methods)
  };

  return createStore(storeConfig, {
    ...methods,
    getInitialState() {
      return initialState || {};
    },
    storeDidUpdate(prevState) {
      if (logUpdates) {
        const updates = _.pickBy(
          this.state,
          (val, key) => !_.isEqual(val, prevState[key])
        );

        if (!_.isEmpty(updates)) {
          console.info(`${name} store was updated:`, updates);
        }
      }
    }
  });
};
