import { createStore } from 'cartiv';
import isEqual from 'lodash/isEqual';
import api from '../';
import graphql from '../graphql';

export default createStore({
    api, name: 'User',
    actions: ['get', 'set', 'unset']
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

    get() {
      return graphql.query(`
        users {
          username
          email
        }
      `)
      .then(users => {
        this.setState(users);
        return users;
      });
    },

    unset() {
      this.setState({ user: null });
      delete localStorage.token;
      delete localStorage.user;
    },

    storeDidUpdate(prevState) {
      if (!isEqual(this.state.user, prevState.user)) {
        console.log('previous state:', prevState);
        console.log('user changed to', this.state.user);
      }
    }
});
