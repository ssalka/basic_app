import { createStore } from 'cartiv';
import _ from 'lodash';
import api from '../';

export default createStore({
    api, name: 'User',
    actions: ['set', 'unset']
  }, {
    getInitialState() {
      return {
        user: null,
        users: null
      };
    },

    set(user) {
      this.setState({ user });
    },

    unset() {
      this.setState({ user: null });
      delete localStorage.token;
    }
});
