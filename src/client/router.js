import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { User } from 'lib/client/api';
import { connect, UserStore } from 'lib/client/api/stores';
import { getGraphQLComponent } from 'lib/client/api/graphql';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import { request, logger } from 'lib/common';
import Splash from './splash';
import Login from './login';
import { App, Home, Collections } from './app';
import { CollectionView, SchemaFormView } from 'lib/client/views';
import './styles.less';

const getCurrentUser = gql`query {
  user: me {
    _id
    username
    library {
      collections {
        _db _collection _id
        name icon path
        description
        fields { name type required isArray }
        defaultView { type }
        creator { username }
      }
    }
  }
}`;

@connect(UserStore)
@graphql(getCurrentUser, {
  props: ({ data }) => data
})
class AppRouter extends BaseComponent {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  componentWillReceiveProps({ user, loading, error }) {
    if (user || _.get(this.props, 'user')) return;
    if (error) console.error(error);
    if (!loading && location.pathname.includes('home')) {
      // done loading; no user; in protected route
      browserHistory.push('/login');
    }
  }

  renderIfAuthenticated = props => this.props.user
    ? <App {...props} />
    : <div></div>;

  getChildContext() {
    const context = { appName: document.title };
    if (this.props.user) {
      context.user = this.props.user;
      User.set(this.props.user);
    }
    else if (_.has(this.state, 'user')) {
      context.user = this.state.user;
    }
    return context;
  }

  getCollectionView({ params, ...props }) {
    props.collection = _.find(
      _.get(this.props.user, 'library.collections', []),
      coll => params.collection === coll.path.slice(1)
    );

    const CollectionViewWithQuery = getGraphQLComponent(
      CollectionView, props.collection
    );

    return <CollectionViewWithQuery {...props} />;
  }

  getSchemaFormView({ location: { state }, ...props }) {
    return (
      <SchemaFormView collection={state.collection} {...props} />
    );
  }

  logout() {
    const { token } = localStorage;
    if (token) {
      request.post('/logout', { token })
        .then(this.logoutCallback)
        .catch(console.error);
    }
  }

  logoutCallback() {
    User.unset();
    browserHistory.push('/');
  }

  get components() {
    return {
      Site: ({children}) => (
        <FlexColumn>
          <NavBar />
          <main>
            {children}
          </main>
        </FlexColumn>
      ),
      NotFound: () => (
        <ViewComponent>
          <h2>Not found</h2>
        </ViewComponent>
      )
    };
  }

  render() {
    const { Site, NotFound } = this.components;
    const collections = _.get(this.props, 'user.library.collections', []);

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>
          <IndexRoute component={Splash} />
          <Route path="login" component={props => (
            <Login {...props} refetch={this.props.refetch} />
          )} />

          <Route component={this.renderIfAuthenticated}>
            <Route path="home" component={Home} />
            <Route path="collections">
              <IndexRoute component={Collections} />
              <Route path="add" component={SchemaFormView} />
              <Route path=":collection">
                <IndexRoute component={this.getCollectionView} />
                <Route path="edit" component={this.getSchemaFormView} />
              </Route>
            </Route>
          </Route>

          <Route path="logout" onEnter={this.logout} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
};

module.exports = AppRouter;
