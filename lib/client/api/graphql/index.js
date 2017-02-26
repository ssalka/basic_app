import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { GetUser } from './queries';
import {
  getGraphQLCollectionType,
  getGraphQLArgument,
  getGraphQLField,
  getGraphQLSelectionSet,
  getGraphQLVariable
} from 'lib/common/graphql';
import { connect, getCollectionStore } from '../stores';
import { User } from '../';

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
    CollectionQuery: ({ _collection, fields }) => {
      const queryArgs = fields.map(getGraphQLVariable).join(',\n');
      const operationArgs = fields.map(getGraphQLArgument).join(', ');
      const selectionSet = getGraphQLSelectionSet(fields);
      return gql`
        query CollectionQuery($ids: [ID!], $limit: Int, ${queryArgs}) {
          ${_collection}(ids: $ids, limit: $limit, ${operationArgs}) {
            __typename _id
            ${selectionSet}
          }
        }
      `;
    },
    FetchMoreQuery: ({ _collection, fields }) => {
      const selectionSet = getGraphQLSelectionSet(fields);
      return gql`
        query FetchMoreQuery($cursor: ID) {
          more_${_collection}(cursor: $cursor) {
            cursor
            ${_collection} {
              ${selectionSet}
            }
          }
        }
      `;
    }
  }
};

const mutations = {
  documents: {
    DocumentMutation: ({ _collection, fields }) => {
      const mutationArgs = fields.map(getGraphQLVariable).join(', ');
      const operationArgs = fields.map(getGraphQLArgument).join(', ');
      const selectionSet = getGraphQLSelectionSet(fields);

      return gql`
        mutation DocumentMutation($_id: ID, ${mutationArgs}) {
          upsert_${_collection}(_id: $_id, ${operationArgs}) {
            __typename _id
            ${selectionSet}
          }
        }
      `
    }
  }
}

function getGraphQLComponent(BaseComponent, data = {}) {
  const { collection, document: _document } = data;

  const CollectionStore = getCollectionStore({
    name: getGraphQLCollectionType(collection),
    initialState: {
      collection: [],
      documents: []
    }
  }, {
    updateDocument(_document) {
      const documents = this.state.documents.slice();
      const indexToUpdate = _.findIndex(documents, { _id: _document._id });

      ~indexToUpdate
        ? documents.splice(indexToUpdate, 1, _document)
        : documents.push(_document);

      this.setState({ documents });
    }
  });

  if (!collection) {
    console.warn('Component passed to getGraphQLComponent without any input data - returning original component');
    return BaseComponent;
  }

  if (_document) {
    // Mutations for Document Form
    const { DocumentMutation } = mutations.documents;
    const documentMutation = DocumentMutation(collection);

    @connect(CollectionStore)
    @mutation(documentMutation, {
      // Send updated document as-is
      getVariables: _.identity
    })
    class GraphQLComponent extends BaseComponent {}

    return GraphQLComponent;
  } else {
    // Queries for Schema Form
    const collectionName = collection._collection;
    const { CollectionQuery, FetchMoreQuery } = queries.collections;
    const collectionQuery = CollectionQuery(collection);
    const fetchMoreQuery = FetchMoreQuery(collection);

    @connect(CollectionStore)
    @graphql(collectionQuery, {
      options: props => ({
        variables: {
          ids: [],
          limit: props.limit || 50
        }
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
