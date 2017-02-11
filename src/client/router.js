import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { User } from 'lib/client/api';
import { connect, UserStore } from 'lib/client/api/stores';
import { getGraphQLComponent, query } from 'lib/client/api/graphql';
import { GetUser } from 'lib/client/api/graphql/queries';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import { request, logger } from 'lib/common';
import Splash from './splash';
import Login from './login';
import { App, Home, Collections } from './app';
import { CollectionView, DocumentForm, DocumentView, SchemaForm } from 'lib/client/views';
import './styles.less';

@query(GetUser)
@connect(UserStore)
class AppRouter extends BaseComponent {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  componentWillReceiveProps({ user, loading, error }) {
    if (error) console.error(error);
    if (!(loading || user) && location.pathname.includes('home')) {
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

  getDocumentView({ params, location, ...props }) {
    const document = location.state.document || _.pick(params, '_id');
    return <DocumentView document={document} pathname={location.pathname} />
  }

  getDocumentForm({ params, ...props }) {
    const document = _.pick(params, '_id');
    return <DocumentForm document={document} {...props} />;
  }

  getSchemaForm({ location: { state }, ...props }) {
    return (
      <SchemaForm collection={state.collection} {...props} />
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
              <Route path="add" component={SchemaForm} />
              <Route path=":collection">
                <IndexRoute component={this.getCollectionView} />
                <Route path="add" component={DocumentForm} />
                <Route path="edit" component={this.getSchemaForm} />
                <Route path=":_id">
                  <IndexRoute component={this.getDocumentView} />
                  <Route path="edit" component={this.getDocumentForm} />
                </Route>
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
