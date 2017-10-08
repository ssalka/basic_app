declare const _;
declare const React;
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Flex } from 'grid-styled';

import api from 'lib/client/api';
import { connect, getCollectionStore, UserStore } from 'lib/client/api/stores';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import { request, logger } from 'lib/common';
import { findDocumentById } from 'lib/common/helpers';
import Splash from './splash';
import Login from './login';
import App, { Home, Collections } from './app';
import CollectionView, { IProps as CollectionViewProps } from './app/collection';
import CollectionForm from './app/collection/form';
import DocumentView from './app/document';
import DocumentForm, { IProps as DocumentFormProps } from './app/document/form';
import {
  Collection as ICollection,
  Field,
  IComponentModule,
  IContext,
  IRouteProps,
  IUser,
  ReactElement
} from 'lib/common/interfaces';
import './styles.less';

const { User, Collection } = api;

interface IAppRouterState {
  user?: IUser;
}

@connect(UserStore)
class AppRouter extends BaseComponent<{}, IAppRouterState> {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  renderIfAuthenticated: React.SFC<IRouteProps> = (
    props => this.state.user ? <App {...props} /> : <div />
  );

  componentDidMount() {
    if (!localStorage.token) {
      return;
    }

    axios.get('/api/me')
      .then(({ data: { user } }) => {
        User.set(user);

        user.library.collections.forEach(
          collection => getCollectionStore({ collection })
        );
      })
      .catch(err => {
        if (err.response.status === 403 && location.pathname !== '/login') {
          console.log('redirect to login');
        }
      });
  }

  getChildContext(): IContext {
    const context: IContext = { appName: document.title };

    if (this.state.user) {
      context.user = this.state.user;
      User.set(this.state.user);
      Collection.add(this.state.user.library.collections);
    }

    return context;
  }

  getCollections = (): ICollection[] => _.get(
    this.state.user,
    'library.collections',
    []
  )

  getCollectionBySlug(slug: string) {
    const collections = this.getCollections();

    return _.find(collections, { slug });
  }

  getCollectionView({ params, ...props }: any) {
    const collection = this.getCollectionBySlug(params.collection);
    const collectionStore = getCollectionStore({ collection });

    const store = api[collection.typeFormats.pascalCase];

    // Queries for Schema Form
    const collectionName = collection._collection;

    @connect(collectionStore)
    class CollectionViewWithQuery extends CollectionView {
      static defaultProps: Partial<CollectionViewProps> = {
        collection,
        store
      };

      componentDidMount() {
        super.componentDidMount();

        if (!this.state.documents.length) {
          axios.get(`/api/collections/${collection._id}/documents`)
            .then(({ data: documents }) => documents)
            .then(store.loadDocumentsSuccess)
            .catch(console.error);
        }
      }
    }

    return <CollectionViewWithQuery {...props} />;
  }

  getDocumentView({ params, location: { state, pathname }, ...props }) {
    const collection = this.getCollectionBySlug(params.collection);
    const _document = state.document || _.pick(params, '_id');

    return (
      <DocumentView
        collection={collection}
        document={_document}
        pathname={pathname}
      />
    );
  }

  getDocumentForm({ params, ...props }: IRouteProps) {
    const collection = this.getCollectionBySlug(params.collection);
    const collections = this.getCollections();

    const collectionField = _.find(collection.fields, field => field._collection);
    const linkedCollection = findDocumentById(collections, collectionField._collection) as ICollection;
    const collectionStore = getCollectionStore({ collection: linkedCollection });
    api[linkedCollection.typeFormats.pascalCase].loadDocuments();

    const Form = collectionField
      ? connect(collectionStore)(DocumentForm)
      : DocumentForm;

    return (
      <Form
        collection={collection}
        collections={collections}
        {...props}
      />
    );
  }

  getCollectionForm({ location: { state }, ...props }) {
    const { collection } = state;
    const collections = this.getCollections();

    return (
      <CollectionForm
        {...props}
        collection={collection}
        collections={collections}
      />
    );
  }

  logout({ history }) {
    const { token } = localStorage;
    if (token) {
      request.post('/logout', { token })
        .then(() => {
          User.unset();
          history.push('/');
        })
        .catch(console.error);
    }

    return (
      <div>
        Logging out...
      </div>
    );
  }

  render() {
    return (
      <Router>
        <Flex column={true} align="stretch">
          <NavBar />
          <Switch>
            <Route path="/" exact={true} component={Splash} />
            <Route path="/login" component={Login} />
            <Route path="/logout" render={this.logout} />
            <Route path="/:param" render={NotFound} />
            {/*<Route component={this.renderIfAuthenticated}>
              <Route path="home" component={Home} />

              <Route path="collections">
                <IndexRoute component={Collections} />
                <Route path="add" component={CollectionForm} />

                <Route path=":collection">
                  <IndexRoute component={this.getCollectionView} />
                  <Route path="add" component={this.getDocumentForm} />
                  <Route path="edit" component={this.getCollectionForm} />

                  <Route path=":_id">
                    <IndexRoute component={this.getDocumentView} />
                    <Route path="edit" component={this.getDocumentForm} />
                  </Route>
                </Route>
              </Route>
            </Route>*/}
          </Switch>
        </Flex>
      </Router>
    );
  }
}

const NotFound = ({ match }) => (
  <ViewComponent>
    <h2>Not found: {match.params.param}</h2>
  </ViewComponent>
);

export default AppRouter;
