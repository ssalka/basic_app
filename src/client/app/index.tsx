declare const _;
declare const React;
import axios from 'axios';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import api from 'lib/client/api';
import { connect, getCollectionStore, UserStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import { ILink, IUser, ReactElement, Collection } from 'lib/common/interfaces';
import { findDocumentById } from 'lib/common/helpers';

import Home from './home';
import Collections from './collections';
import CollectionView, { IProps as CollectionViewProps } from './collection';
import CollectionForm from './collection/form';
import DocumentView from './document';
import DocumentForm, { IProps as DocumentFormProps } from './document/form';
import './styles.less';

interface IState {
  user: IUser;
  navLinks: ILink[];
}

@connect(UserStore)
class App extends ViewComponent<RouteComponentProps<any>, IState> {
  state: IState = {
    user: {} as IUser,
    navLinks: [{ name: 'Home', path: '/home', icon: 'home' }]
  };

  getCollections = (): Collection[] =>
    _.get(this.state.user, 'library.collections', []);

  getCollectionBySlug(slug: string) {
    const collections = this.getCollections();

    return _.find(collections, { slug });
  }

  getCollectionView({ match, ...props }: any) {
    const collection = this.getCollectionBySlug(match.params.collection);
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
          axios
            .get(`/api/collections/${collection._id}/documents`)
            .then(({ data: documents }) => documents)
            .then(store.loadDocumentsSuccess)
            .catch(console.error);
        }
      }
    }

    return <CollectionViewWithQuery {...props} />;
  }

  getDocumentView({ match, location: { state, pathname }, ...props }) {
    const collection = this.getCollectionBySlug(match.params.collection);
    const _document = state.document || _.pick(match.params, '_id');

    return (
      <DocumentView
        collection={collection}
        document={_document}
        pathname={pathname}
      />
    );
  }

  getDocumentForm({ match, ...props }: RouteComponentProps<any>) {
    const collection = this.getCollectionBySlug(match.params.collection);
    const collections = this.getCollections();

    let Form = DocumentForm;
    const collectionField = _.find(collection.fields, '_collection');

    if (collectionField) {
      const linkedCollection = findDocumentById(
        collections,
        collectionField._collection
      ) as Collection;
      const collectionStore = getCollectionStore({
        collection: linkedCollection
      });

      api[linkedCollection.typeFormats.pascalCase].loadDocuments();

      Form = connect(collectionStore)(Form);
    }

    return (
      <Form collection={collection} collections={collections} {...props} />
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

  render() {
    const { user, navLinks } = this.state;
    const { pathname } = this.props.location;

    const viewLinks: ILink[] = _(user)
      .get('library.collections', [])
      .slice(0, 5)
      .map((collection: Collection) =>
        _.pick(collection, ['name', 'path', 'icon'])
      );
    const links: ILink[] = navLinks.concat(viewLinks);

    return (
      <FlexRow id="app">
        <SideBar links={links} currentPath={pathname} />
        <div id="content">
          {user && user.library ? (
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/collections" exact={true} component={Collections} />
              <Route
                path="/collections/add"
                exact={true}
                component={CollectionForm}
              />
              <Route
                path="/collections/:collection"
                exact={true}
                render={this.getCollectionView}
              />
              <Route
                path="/collections/:collection/edit"
                exact={true}
                render={this.getCollectionForm}
              />
              <Route
                path="/collections/:collection/add"
                exact={true}
                render={this.getDocumentForm}
              />
              <Route
                path="/collections/:collection/:_id"
                exact={true}
                render={this.getDocumentView}
              />
              <Route
                path="/collections/:collection/:_id/edit"
                exact={true}
                render={this.getDocumentForm}
              />
            </Switch>
          ) : (
            <div>Loading your library...</div>
          )}
        </div>
      </FlexRow>
    );
  }
}

export default App;
