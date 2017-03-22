declare const _;
declare const React;
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import api from 'lib/client/api';
import { connect, UserStore, getCollectionStore } from 'lib/client/api/stores';
import { getGraphQLComponent, query, queries } from 'lib/client/api/graphql';
import { GetUser } from 'lib/client/api/graphql/queries';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import { Collection, IComponentModule, IContext, IUser, ReactElement, IQueryProps } from 'lib/client/interfaces';
import common = require('lib/common');
import { getGraphQLCollectionType } from 'lib/common/graphql';
import Splash from './splash';
import Login from './login';
import App, { Home, Collections } from './app';
import CollectionView from './app/collection';
import SchemaForm from './app/collection/form';
import DocumentView from './app/document';
import DocumentForm from './app/document/form';
import './styles.less';

const { request, logger } = common as any;
const { User } = api;

interface IProps extends IQueryProps {
  user: IUser;
}

@query(GetUser)
@connect(UserStore)
class AppRouter extends BaseComponent<any, any> {
  public static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  private getCollectionStore = _.memoize((collection: Collection[], documents: any[] = []) => (
    getCollectionStore({
      name: getGraphQLCollectionType(collection as any),
      logUpdates: true,
      initialState: {
        collection,
        documents
      }
    }, {
      loadDocuments(documents: any[]) {
        this.setState({ documents });
      },
      updateDocument(_document: any) {
        const documents: any[] = this.state.documents.slice();

        const indexToUpdate: number = _.findIndex(documents, { _id: _document._id });

        indexToUpdate >= 0
          ? documents.splice(indexToUpdate, 1, _document)
          : documents.push(_document);

        this.setState({ documents });
      }
    })
  ));

  private componentWillReceiveProps({ user, loading, error }: IProps) {
    if (error) {
      console.error(error);
    }
    if (!(loading || user) && _.includes(location.pathname, 'home')) {
      // done loading; no user; in protected route
      browserHistory.push('/login');
    }
  }

  private renderIfAuthenticated = (props: IProps): ReactElement => (
    this.props.user
      ? <App {...props} />
      : <div />
  )

  public getChildContext(): IContext {
    const context: IContext = { appName: document.title };
    if (this.props.user) {
      context.user = this.props.user;
      User.set(this.props.user);
    } else if (_.has(this.state, 'user')) {
      context.user = this.state.user;
    }

    return context;
  }

  private getCollectionBySlug(slug: string) {
    const collections = _.get(this.props.user, 'library.collections', []);

    return _.find(collections, { slug });
  }

  private getCollectionView({ params, ...props }: any) {
    const collection = props.collection = this.getCollectionBySlug(params.collection);
    const CollectionStore = this.getCollectionStore(collection);
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
    const CollectionStore = this.getCollectionStore(collection, [_document]);
    const DocumentFormWithMutation = getGraphQLComponent(DocumentForm, CollectionStore, {
      collection, document: _document
    });

    return <DocumentFormWithMutation {...props} />;
  }

  private getSchemaForm({ location: { state }, ...props }) {
    return (
      <SchemaForm collection={state.collection} {...props} />
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
    const getLoginPage = (props: React.Props<any>) => (
      <Login {...props} refetch={this.props.refetch} />
    );

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>
          <IndexRoute component={Splash} />
          <Route path="login" component={getLoginPage} />

          <Route component={this.renderIfAuthenticated}>
            <Route path="home" component={Home} />
            <Route path="collections">
              <IndexRoute component={Collections} />
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

export default AppRouter;
