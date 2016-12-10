import { createStore } from 'cartiv';
import _ from 'lodash';
import api from '../';
import graphql from '../graphql';

export default createStore({
    api, name: 'User',
    actions: ['get', 'getLibrary', 'set', 'unset']
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

    getLibrary(userId) {
      return graphql.query(`
        user(id: "${userId}") {
          library {
            collections { name icon path }
          }
        }
      `)
        .then(data => {
          _.defaults(data.user, this.state.user);
          this.setState(data);
        });
    },

    unset() {
      this.setState({ user: null });
      delete localStorage.token;
    }
});
