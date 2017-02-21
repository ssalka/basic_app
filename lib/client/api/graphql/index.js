import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { GetUser } from './queries';
import { getGraphQLArgument, getGraphQLField } from 'lib/common/graphql';

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

const queries = {
  GetUser,
  collections: {
    CollectionQuery: (collectionName, fieldNames) => gql`
      query CollectionQuery($ids: [ID!], $limit: Int) {
        ${collectionName}(ids: $ids, limit: $limit) {
          __typename _id
          ${fieldNames}
        }
      }
    `,
    FetchMoreQuery: (collectionName, fieldNames) => gql`
      query FetchMoreQuery($cursor: ID) {
        more_${collectionName}(cursor: $cursor) {
          cursor
          ${collectionName} {
            ${fieldNames}
          }
        }
      }
    `
  }
};

const mutations = {
  documents: {
    DocumentMutation: ({ _collection, fields }) => {
      const mutationArgs = fields.map(getGraphQLField).map(field => `$${field}`).join(',\n');
      const operationArgs = fields.map(getGraphQLArgument).join(',\n');
      const fieldNames = _.map(fields, 'name').map(_.camelCase).join('\n');

      return gql`
        mutation DocumentMutation(
          $_id: ID,
          ${mutationArgs}
        ) {
          upsert_${_collection}(
            _id: $_id,
            ${operationArgs}
          ) {
            ${fieldNames}
          }
        }
      `
    }
  }
}

function getGraphQLComponent(BaseComponent, data = {}) {
  const fieldNames = _.map(data.collection.fields, 'name').map(_.camelCase).join('\n');

  if (data.document) {
    // Mutations for Document Form
    const { collection, document: _document } = data;
    const { DocumentMutation } = mutations.documents;
    const documentMutation = DocumentMutation(collection);
    const getVariables = _.identity; // Send updated document as-is (TODO: object diff)

    @mutation(documentMutation, { getVariables })
    class GraphQLComponent extends BaseComponent {}

    return GraphQLComponent;
  } else if (data.collection) {
    // Queries for Schema Form
    const { collection } = data;
    const collectionName = collection._collection;

    const { CollectionQuery, FetchMoreQuery } = queries.collections;
    const collectionQuery = CollectionQuery(collectionName, fieldNames);
    const fetchMoreQuery = FetchMoreQuery(collectionName, fieldNames);

    @graphql(collectionQuery, {
      options: props => ({
        variables: { ids: [], limit: props.limit || 50 }
      }),
      props: ({ data, loading, cursor, ...props }) => (
        _.assign(props, _.omit(data, 'fetchMore'), {
          loadNextPage: getFetchMoreFunction(
            data.fetchMore,
            fetchMoreQuery,
            collectionName,
            cursor
          )
        })
      )
    })
    class GraphQLComponent extends BaseComponent {}

    return GraphQLComponent;

  } else {
    console.warn('Component passed to getGraphQLComponent without any input data - returning original component');
    return BaseComponent;
  }
}

function getFetchMoreFunction(fetchMore, fetchMoreQuery, collectionName, cursor) {
  return () => fetchMore({
    query: fetchMoreQuery,
    variables: { cursor },
    updateQuery: (previous, { fetchMoreResult }) => {
      const documents = previous[collectionName];
      const {
        cursor: newCursor,
        [collectionName]: newDocuments
      } = fetchMoreResult.data[`more_${collectionName}`];

      // TODO: figure out how to get this onto props/state
      return {
        cursor: newCursor,
        [collectionName]: [...newDocuments, ...documents]
      };
    },
  })
}

module.exports = {
  query, mutation,
  getGraphQLComponent,
  queries
};
