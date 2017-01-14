import _ from 'lodash';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

module.exports = {
  getGraphQLQuery,
  getGraphQLComponent
};

function getGraphQLQuery({ creator, _collection, fields }) {
  const collection = [creator.username, _collection].join('_');
  const fieldNames = _.map(fields, 'name').map(_.camelCase).join('\n');

  return gql`
    query CollectionQuery($ids: [ID!], $limit: Int) {
      ${collection}(ids: $ids, limit: $limit) {
        _id
        ${fieldNames}
      }
    }
  `;
}

function getGraphQLComponent(BaseComponent, collection) {
  const query = getGraphQLQuery(collection);
  @graphql(query, {
    options: props => ({
      variables: { ids: [], limit: props.limit || 100 }
    }),
    props: ({ data, ...props }) => _.assign(props, data)
  })
  class GraphQLComponent extends BaseComponent {}

  return GraphQLComponent;
}
