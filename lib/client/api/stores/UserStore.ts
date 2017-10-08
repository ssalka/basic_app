import * as _ from 'lodash';
import { createStore } from 'cartiv';
import api from '../';

export default createStore(
  {
    api,
    name: 'User',
    actions: ['set', 'unset', 'updateLibrary']
  },
  {
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
    },

    updateLibrary(updates) {
      const { user } = this.state;

      if (updates.__typename === 'Collection') {
        const collectionIndex = _.findIndex(user.library.collections, {
          _id: updates._id
        });

        if (collectionIndex === -1) {
          user.library.collections.push(updates);
        } else {
          user.library.collections[collectionIndex] = updates;
          this.setState({ user });
        }
      }
    }
  }
);
