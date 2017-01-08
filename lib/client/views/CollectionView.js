import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

const GetCollection = gql`
  query GetCollection($id: ID!, $limit: Int) {
    getCollection(id: $id, limit: $limit) {
      body
    }
  }
`;

@graphql(GetCollection, {
  options: ({ collection }) => ({
    variables: { id: collection._id, limit: 25 }
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
  constructor(props) {
    super(props);
    console.info(
      'User Collection', props.collection._id,
      _.omit(props.collection, '_id')
    );
  }
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
    return (
      <FlexColumn className="collection-view">
        <FlexRow justifyContent="flex-start" alignItems="center">
          <Icon name={collection.icon} size={22} />
          <h3>{collection.name}</h3>
        </FlexRow>
        {documents.length ? (
          <View content={documents} headers={headers} />
        ) : (
          <NonIdealState
            visual={collection.icon || 'document'}
            title={`You don't have any ${collection.name}`}
            description={<span>All {collection.name.toLowerCase()} you add will be visible here</span>}
            action={(
              <Link to={`collections${collection.path}/add`}>
                <Button icon="add"
                  text={`Add ${_.singularize(collection.name)}`}
                  minimal={true}
                  rounded={true}
                  color="primary"
                />
              </Link>
            )}
          />
        )}
      </FlexColumn>
    );
  }
}

module.exports = CollectionView;
