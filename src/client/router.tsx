declare const _;
declare const React;
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import api from 'lib/client/api';
import { connect, UserStore, getCollectionStore } from 'lib/client/api/stores';
import { getGraphQLComponent, query, queries } from 'lib/client/api/graphql';
import { GetUser } from 'lib/client/api/graphql/queries';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import common = require('lib/common');
import { getGraphQLCollectionType } from 'lib/common/graphql';
import Splash = require('./splash');
import Login = require('./login');
import App, { Home, Collections } from './app';
import CollectionView from './app/collection';
import SchemaForm from './app/collection/form';
import DocumentView from './app/document';
import DocumentForm = require('./app/document/form');
import './styles.less';

const { request, logger } = common as any;
const { User } = api;

@query(GetUser)
@connect(UserStore)
class AppRouter extends BaseComponent<any, any> {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  componentWillReceiveProps({ user, loading, error }) {
    if (error) console.error(error);
    if (!(loading || user) && _.includes(location.pathname, 'home')) {
      // done loading; no user; in protected route
      browserHistory.push('/login');
    }
  }

  renderIfAuthenticated = props => this.props.user
    ? <App {...props} />
    : <div></div>;

  getChildContext() {
    const context: any = { appName: document.title };
    if (this.props.user) {
      context.user = this.props.user;
      User.set(this.props.user);
    }
    else if (_.has(this.state, 'user')) {
      context.user = this.state.user;
    }
    return context;
  }

  getCollectionBySlug(slug) {
    const collections = _.get(this.props.user, 'library.collections', []);
    return _.find(collections, { slug });
  }

  getCollectionStore = _.memoize((collection, documents = []) => (
    getCollectionStore({
      name: getGraphQLCollectionType(collection),
      logUpdates: true,
      initialState: {
        collection,
        documents
      }
    }, {
      loadDocuments(documents) {
        this.setState({ documents });
      },
      updateDocument(_document) {
        const documents = this.state.documents.slice();

        const indexToUpdate = _.findIndex(documents, { _id: _document._id });

        indexToUpdate >= 0
          ? documents.splice(indexToUpdate, 1, _document)
          : documents.push(_document);

        this.setState({ documents });
      }
    })
  ));

  getCollectionView({ params, ...props }: any) {
    const collection = props.collection = this.getCollectionBySlug(params.collection);
    const CollectionStore = this.getCollectionStore(collection);
    const CollectionViewWithQuery = getGraphQLComponent(CollectionView, CollectionStore, { collection });

    return <CollectionViewWithQuery {...props} />;
  }

  getDocumentView({ params, location: { state, pathname }, ...props }) {
    const _document = state.document || _.pick(params, '_id');
    return <DocumentView document={_document} pathname={pathname} />
  }

  getDocumentForm({ params, ...props }: any) {
    const _document = _.pick(params, '_id');
    const collection = props.collection = this.getCollectionBySlug(params.collection);
    const CollectionStore = this.getCollectionStore(collection, [_document]);
    const DocumentFormWithMutation = getGraphQLComponent(DocumentForm, CollectionStore, {
      collection, document: _document
    });

    return <DocumentFormWithMutation {...props} />;
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

    // TODO: convert these to TS
    const JSSplash = Splash as any;
    const JSHome = Home as any;
    const JSLogin = Login as any;
    const JSCollections = Collections as any;

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>
          <IndexRoute component={JSSplash} />
          <Route path="login" component={props => (
            <JSLogin {...props} refetch={this.props.refetch} />
          )} />

          <Route component={this.renderIfAuthenticated}>
            <Route path="home" component={JSHome} />
            <Route path="collections">
              <IndexRoute component={JSCollections} />
              <Route path="add" component={SchemaForm} />
              <Route path=":collection">
                <IndexRoute component={this.getCollectionView} />
                <Route path="add" component={this.getDocumentForm} />
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
