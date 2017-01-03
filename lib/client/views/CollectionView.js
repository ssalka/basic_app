import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent } from 'lib/client/components';

// @graphql(gql`query {}`, {
//   props: ({ data }) => ({
//     ..._.pickBy(data, ['result', 'loading', 'error']),
//     ..._.pickBy(props, ['collection'])
//   })
// })
class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {}
  };

  render() {
    const { collection } = this.props;

    const View = _.get({
      // TODO: uncomment once TableView is implemented
      // TABLE: TableView
    }, this.props.collection.defaultView, ViewComponent);
    return (
      //  TODO: pass in documents, read from _.keys(View.defaultProps)
      //  to know how to pass them in
      <View>
        <h2>{collection.name}</h2>
      </View>
    );
  }
}

module.exports = CollectionView;
