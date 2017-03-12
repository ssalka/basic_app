declare const _;
declare const React;
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import * as inflection from 'lodash-inflection';
import * as ReactDOM from 'react-dom';
import AppRouter from './router';
_.mixin(inflection);

const client: ApolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    opts: { credentials: 'same-origin' }
  }),
  dataIdFromObject(result: any): string | null {
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
