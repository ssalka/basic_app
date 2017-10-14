import * as _ from 'lodash';
import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps, Switch, Route } from 'react-router';

import api from 'lib/client/api';
import { connect, getCollectionStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import {
  ILink,
  IUser,
  ReactElement,
  Collection,
  Field,
  IReduxProps
} from 'lib/common/interfaces';
import { findDocumentById } from 'lib/common/helpers';

import Home from './home';
import Collections from './collections';
import CollectionView, { IProps as CollectionViewProps } from './collection';
import CollectionForm from './collection/form';
import DocumentView from './document';
import DocumentForm, { IProps as DocumentFormProps } from './document/form';
import './styles.less';

interface IState {
  navLinks: ILink[];
}

export default class App extends ViewComponent<
  IReduxProps & RouteComponentProps<any>,
  IState
> {
  state: IState = {
    navLinks: [{ name: 'Home', path: '/home', icon: 'home' }]
  };

  getCollections = (): Collection[] =>
    _.get(this.props.store.user.user, 'library.collections', []);

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
    const collectionField: Field = _.find(collection.fields, '_collection');

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

  renderWithStore = _.curry(
    (Component: React.ComponentType, props: RouteComponentProps<any>) => (
      <Component {..._.pick(this.props, 'store', 'actions')} {...props} />
    )
  );

  render() {
    const { user } = this.props.store.user;
    const { pathname } = this.props.location;
    const { navLinks } = this.state;

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
              <Route
                path="/home"
                exact={true}
                render={this.renderWithStore(Home)}
              />
              <Route
                path="/collections"
                exact={true}
                render={this.renderWithStore(Collections)}
              />
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
