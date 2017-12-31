import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';

import {
  ReduxComponent,
  FlexRow,
  NavBar,
  SideBar,
  NotFound
} from 'lib/client/components';
import { ILink, Collection, IUser } from 'lib/common/interfaces';

import Home from './home';
import CombineEntities from './CombineEntities';
import Collections from './collections';
import CollectionView from './collectionView';
import CollectionForm from './collectionForm';
import DocumentView from './documentView';
import DocumentForm from './documentForm';
import './styles.less';

const Loading = () => <div>Loading your library...</div>;

interface IState {
  navLinks: ILink[];
}

export default class App extends ReduxComponent<RouteComponentProps<any>, IState> {
  state: IState = {
    navLinks: [{ name: 'Home', path: '/home', icon: 'home' }]
  };

  getCollections = (): Collection[] =>
    _.get(this.props.store.user.user, 'library.collections', []);

  getCollectionBySlug(slug: string) {
    const collections = this.getCollections();

    return _.find(collections, { slug });
  }

  getDocumentView({ match, location: { state, pathname }, ...props }) {
    const collection = this.getCollectionBySlug(match.params.collection);
    const _document = state.document || _.pick(match.params, '_id');

    return (
      <DocumentView collection={collection} document={_document} pathname={pathname} />
    );
  }

  getDocumentForm({ match, ...props }: RouteComponentProps<any>) {
    const collection = this.getCollectionBySlug(match.params.collection);

    return <DocumentForm collection={collection} {...props} />;
  }

  getCollectionForm({ location: { state }, ...props }) {
    const { collection } = state;
    const collections = this.getCollections();

    return (
      <CollectionForm {...props} collection={collection} collections={collections} />
    );
  }

  renderWithStore = _.curry(
    (Component: React.ComponentType, props: RouteComponentProps<any>) => (
      <Component {..._.pick(this.props, 'store', 'actions')} {...props} />
    )
  );

  getViewLinks: (user: IUser) => ILink[] = _.memoize(user =>
    _(user)
      .get('library.collections', [])
      .slice(0, 5)
      .map((collection: Collection): ILink =>
        _.pick(collection, ['name', 'path', 'icon'])
      )
  );

  render() {
    const { user } = this.props.store.user;
    const { pathname } = this.props.location;
    const { navLinks } = this.state;
    const links = navLinks.concat(this.getViewLinks(user));

    return (
      <FlexRow id="app">
        <SideBar links={links} currentPath={pathname} />

        <div id="content">
          <Switch>
            <Route path="/home" exact={true} render={this.renderWithStore(Home)} />

            {_.isEmpty(this.props.store.collection.collections) ? (
              <Route render={Loading} />
            ) : (
              <Switch>
                <Route
                  path="/collections"
                  exact={true}
                  render={this.renderWithStore(Collections)}
                />

                <Route path="/collections/add" exact={true} component={CollectionForm} />

                <Route
                  path="/collections/:collection"
                  exact={true}
                  component={CollectionView}
                />

                <Route
                  path="/collections/:collection/edit"
                  exact={true}
                  render={this.getCollectionForm}
                />

                <Route
                  path="/collections/:collection/:_id"
                  exact={true}
                  render={this.getDocumentView}
                />

                <Route
                  path="/collections/:collection/add"
                  exact={true}
                  render={this.getDocumentForm}
                />

                <Route
                  path="/collections/:collection/:_id/edit"
                  exact={true}
                  render={this.getDocumentForm}
                />

                <Route
                  path="/combine-entities"
                  exact={true}
                  component={CombineEntities}
                />

                <Route path="/:param" render={NotFound} />
              </Switch>
            )}
          </Switch>
        </div>
      </FlexRow>
    );
  }
}
