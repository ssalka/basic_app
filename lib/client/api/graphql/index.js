import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { GetUser } from './queries';

module.exports = {
  query, mutation,
  getGraphQLQuery,
  getGraphQLComponent,
  queries: { GetUser }
};

function query(gqlQuery, options = {}) {
  return graphql(gqlQuery, _.defaults(options, {
    props: ({ data, ...props }) => _.assign(props, data)
  }));
}

function mutation(gqlMutation, { getVariables, variables } = {}) {
  const mutationName = gqlMutation.definitions[0].selectionSet.selections[0].name.value;

  return graphql(gqlMutation, {
    props: ({ mutate, ...props }) => ({
      ...props, [mutationName]: (...args) => mutate({
        variables: getVariables ? getVariables(...args) : variables
      })
    })
  });
}

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
