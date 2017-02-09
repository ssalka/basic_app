import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

module.exports = {
  query, mutation,
  getGraphQLQuery,
  getGraphQLComponent
};

function query(gqlQuery, options = {}) {
  return graphql(gql`query ${gqlQuery}`, _.defaults(options, {
    props: ({ data, ...props }) => _.assign(props, data)
  }));
}

function mutation(gqlMutation, { getVariables, variables } = {}) {
  const mutationPart = gqlMutation.split(') {')[1].trim();
  const mutationName = mutationPart.slice(
    mutationPart.indexOf(': ') + 2,
    mutationPart.indexOf('(')
  );

  return graphql(gql`mutation ${gqlMutation}`, {
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
