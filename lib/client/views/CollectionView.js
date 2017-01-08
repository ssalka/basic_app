import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent, Table } from 'lib/client/components';

const GetCollection = gql`
  query GetCollection($id: ID!) {
    getCollection(id: $id) {
      body
    }
  }
`;

@graphql(GetCollection, {
  options: ({ collection }) => ({
    variables: { id: collection._id }
  }),
  props: ({ data }) => ({
    ..._.pick(data, ['loading', 'error']),
    documents: _(data.getCollection)
      .map('body')
      .map(JSON.parse)
      .value()
  })
})
class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {},
    documents: []
  };

  render() {
    const { collection, documents } = this.props;

    const View = _.get({
      TABLE: Table
    }, collection.defaultView, Table);
    return documents.length
      ? <View content={documents} headers={_.keys(documents[0])} />
      : null;
  }
}

module.exports = CollectionView;
