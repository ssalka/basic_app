import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn } from 'lib/client/components';
import '../styles/CollectionView.less';

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
    const headers = _.map(collection.fields, 'name');
    const View = _.get({
      TABLE: Table
    }, collection.defaultView, Table);
    return documents.length ? (
      <FlexColumn className="collection-view">
        <FlexRow justifyContent="flex-start" alignItems="center">
          <Icon name={collection.icon} size={22} />
          <h3>{collection.name}</h3>
        </FlexRow>
        <View content={documents} headers={headers} />
      </FlexColumn>
    ) : null;
  }
}

module.exports = CollectionView;
