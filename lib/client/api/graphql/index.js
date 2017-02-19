import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { GetUser } from './queries';

module.exports = {
  query, mutation,
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

function getGraphQLQuery(collectionName, fieldNames, fetchMoreOptions) {
  return fetchMoreOptions ? gql`
    query FetchMoreQuery($cursor: ID) {
      ${fetchMoreOptions.queryName}(cursor: $cursor) {
        cursor
        ${collectionName} {
          ${fieldNames}
        }
      }
    }
    ` : gql`
    query CollectionQuery($ids: [ID!], $limit: Int) {
      ${collectionName}(ids: $ids, limit: $limit) {
        __typename _id
        ${fieldNames}
      }
    }
  `;
}

function getGraphQLComponent(BaseComponent, collection) {
  const collectionName = collection._collection;
  const fetchMoreQueryName = `more_${collectionName}`;
  const fieldNames = _.map(collection.fields, 'name').map(_.camelCase).join('\n');
  const query = getGraphQLQuery(collectionName, fieldNames);
  const fetchMoreQuery = getGraphQLQuery(collectionName, fieldNames, {
    queryName: fetchMoreQueryName
  });

  @graphql(query, {
    options: props => ({
      variables: { ids: [], limit: props.limit || 50 }
    }),
    props: ({ data, loading, cursor, comments, ...props }) => (
      _.assign(props, data, {
        loadNextPage: () => props.fetchMore({
          query: fetchMoreQuery,
          variables: { cursor },
          updateQuery: (previous, { fetchMoreResult }) => {
            const documents = previous[collectionName];
            const results = fetchMoreResult.data[fetchMoreQueryName];

            console.log('loadNextPage result', {
              cursor: results.cursor,
              [collectionName]: [
                ...results[collectionName],
                ...documents
              ]
            });

            return {
              cursor: results.cursor,
              [collectionName]: [
                ...results[collectionName],
                ...documents
              ]
            };
          },
        }),
      })
    )
  })
  class GraphQLComponent extends BaseComponent {}

  return GraphQLComponent;
}
