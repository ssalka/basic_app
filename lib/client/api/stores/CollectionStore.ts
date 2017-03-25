declare const _;
import createStore from './createStore';
import { Collection } from 'lib/client/interfaces';

export default createStore({
  name: 'Collection',
  initialState: {
    collections: []
  }
}, {
  add(collection: Collection) {
    if (_.find(this.state.collections, { _id: collection._id })) {
      return;
    }
    const collections: Collection[] = this.state.collections.concat(collection);
    this.setState({ collections });
  },

  find: (query?: object): Collection[] => _.isEmpty(query)
    ? this.state.collections
    : _.filter(this.state.collections, query)
});
