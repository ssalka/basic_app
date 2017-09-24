declare const _;
declare const React;
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from 'axios';
import api from 'lib/client/api';
import { connect, getCollectionStore, UserStore } from 'lib/client/api/stores';
import { getGraphQLComponent, query, queries } from 'lib/client/api/graphql';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import common = require('lib/common');
import Splash from './splash';
import Login from './login';
import App, { Home, Collections } from './app';
import CollectionView from './app/collection';
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
    const collection = props.collection = this.getCollectionBySlug(params.collection);
    const CollectionStore = getCollectionStore({ collection });
    const CollectionViewWithQuery = getGraphQLComponent(CollectionView, CollectionStore, { collection });

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

  private getDocumentForm({ params, ...props }: any) {
    const _document = _.pick(params, '_id');
    const collection = props.collection = this.getCollectionBySlug(params.collection);
    const CollectionStore = getCollectionStore({
      collection,
      documents: [_document]
    });
    const DocumentFormWithMutation = getGraphQLComponent(DocumentForm, CollectionStore, {
      collection, document: _document
    });

    return <DocumentFormWithMutation {...props} />;
  }

  private getCollectionForm({ location: { state }, ...props }) {
    return (
      <CollectionForm collection={state.collection} {...props} />
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
