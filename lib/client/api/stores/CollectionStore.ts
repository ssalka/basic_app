declare const _;
import createStore from './createStore';
import { Collection } from 'lib/client/interfaces';

export default createStore({
  name: 'Collection',
  initialState: {
    collections: []
  },
  logUpdates: true
}, {
  add(collection: Collection | Collection[]) {
    if (!_.isArray(collection) && this.exists(collection)) {
      return;
    }
    const collections: Collection[] = this.state.collections.concat(
      _.isArray(collection)
        ? _.differenceBy(collection, this.state.collections, '_id')
        : collection
    );
    this.setState({ collections });
  },

  find: (query?: object): Collection[] => _.isEmpty(query)
    ? this.state.collections
    : _.filter(this.state.collections, query),

  exists({_id}: Collection) {
    return _.find(this.state.collections, { _id });
  }
});
