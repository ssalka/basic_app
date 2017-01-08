import _ from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent } from 'lib/client/components';

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
      // TODO: uncomment once TableView is implemented
      // TABLE: TableView
    }, collection.defaultView, ViewComponent);
    return (
      //  TODO: read from _.keys(View.defaultProps)
      //  to know how to pass documents into view
      <View>
        <h2>{collection.name}</h2>
        {documents.map(doc => (
          <div>
            <strong>{doc.title}</strong>
            &nbsp;&nbsp;
            <span>{doc.note}</span>
          </div>
        ))}
      </View>
    );
  }
}

module.exports = CollectionView;
