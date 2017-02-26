import ReactDOM from 'react-dom';
import AppRouter from './router';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
_.mixin(require('lodash-inflection'));

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    opts: { credentials: 'same-origin' }
  }),
  dataIdFromObject(result) {
    return result._id && result.__typename
      ? result.__typename + result._id
      : null;
  },
  connectToDevTools: location.hostname === 'localhost'
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>,
  document.getElementById('root')
);
