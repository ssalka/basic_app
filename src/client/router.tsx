declare const _;
declare const React;
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from 'axios';
import api from 'lib/client/api';
import { connect, getCollectionStore, UserStore } from 'lib/client/api/stores';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import common = require('lib/common');
import Splash from './splash';
import Login from './login';
import App, { Home, Collections } from './app';
import CollectionView, { IProps as CollectionViewProps } from './app/collection';
import CollectionForm from './app/collection/form';
import DocumentView from './app/document';
import DocumentForm from './app/document/form';
import {
  Collection as ICollection,
  IComponentModule,
  IContext,
  IRouteProps,
  IUser,
  ReactElement
} from 'lib/client/interfaces';
import './styles.less';

const { request, logger } = common as any;
const { User, Collection } = api;

interface IAppRouterState {
  user?: IUser;
}

@connect(UserStore)
class AppRouter extends BaseComponent<{}, IAppRouterState> {
  public static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  private renderIfAuthenticated: React.SFC<IRouteProps> = (
    props => this.state.user ? <App {...props} /> : <div />
  );

  componentDidMount() {
    if (!localStorage.token) {
      return;
    }

    axios.get('/api/me')
      .then(res => {
        if (res.data.user) {
          User.set(res.data.user);
        }
      })
      .catch(err => {
        if (err.response.status === 403 && location.pathname !== '/login') {
          browserHistory.push('/login');
        }
      });
  }

  public getChildContext(): IContext {
    const context: IContext = { appName: document.title };

    if (this.state.user) {
      context.user = this.state.user;
      User.set(this.state.user);
      Collection.add(this.state.user.library.collections);
    }

    return context;
  }

  private getCollectionBySlug(slug: string) {
    const collections = _.get(this.state.user, 'library.collections', []);

    return _.find(collections, { slug });
  }

  private getCollectionView({ params, ...props }: any) {
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
            .then(store.loadDocuments)
            .catch(console.error);
        }
      }
    }

    return <CollectionViewWithQuery {...props} />;
  }

  private getDocumentView({ params, location: { state, pathname }, ...props }) {
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

  private getDocumentForm({ params, ...props }: IRouteProps) {
    const collection = this.getCollectionBySlug(params.collection);

    return <DocumentForm collection={collection} {...props} />;
  }

  private getCollectionForm({ location: { state }, ...props }) {
    const { collection } = state;
    const collections = _.get(this.state.user, 'library.collections', []);

    return (
      <CollectionForm
        {...props}
        collection={collection}
        collections={collections}
      />
    );
  }

  private logout() {
    const { token } = localStorage;
    if (token) {
      request.post('/logout', { token })
        .then(this.logoutCallback)
        .catch(console.error);
    }
  }

  private logoutCallback() {
    User.unset();
    browserHistory.push('/');
  }

  get components(): IComponentModule {
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

  public render() {
    const { Site, NotFound } = this.components;
    const collections = _.get(this.props, 'user.library.collections', []);

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>
          <IndexRoute component={Splash} />
          <Route path="login" component={Login} />

          <Route component={this.renderIfAuthenticated}>
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
          </Route>

          <Route path="logout" onEnter={this.logout} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
};

export default AppRouter;
