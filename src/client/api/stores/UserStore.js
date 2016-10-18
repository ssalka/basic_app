import { createStore } from 'cartiv';
import api from '../';
import isEqual from 'lodash/isEqual';

export default createStore({
    api,
    name: 'User',
    actions: ['set', 'unset']
  }, {
    getInitialState() {
      return { user: null };
    },

    set(user) {
      this.setState({ user });
    },

    unset() {
      this.setState(this.getInitialState());
    },

    storeDidUpdate(prevState) {
      if (!isEqual(this.state.user, prevState.user)) {
        console.log('previous state:', prevState);
        console.log('user changed to', this.state.user);
      }
    }
});
