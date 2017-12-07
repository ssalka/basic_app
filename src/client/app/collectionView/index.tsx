import * as _ from 'lodash';
import * as React from 'react';

import { Flex } from 'grid-styled';
import { RouteComponentProps } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { connect } from 'lib/client/api/store';
import { ReduxComponent, Table, FlexColumn } from 'lib/client/components';
import { Collection, IComponentModule } from 'lib/common/interfaces';
import getComponents from './components';
import './styles.less';

export interface IState {
  collection: Collection;
  loading: boolean;
}

export class CollectionView extends ReduxComponent<RouteComponentProps<any>, IState> {
  constructor(props) {
    super(props);
    const collection = _.find(props.store.collection.collections, {
      path: props.match.url
    });

    this.state = {
      collection,
      loading: false
    };
  }

  componentDidMount() {
    const { _id: collectionId, ...collection } = this.state.collection;
    console.info('User Collection', collectionId, collection);

    const notLoading = !this.state.loading;
    const noDocuments = !this.props.store.documents.byCollection[collectionId];

    if (notLoading && noDocuments) {
      this.loadDocuments(collectionId);
    }
  }

  componentWillReceiveProps({ match, store }) {
    const { collection, loading } = this.state;
    const finishedLoading = loading && store.documents.byCollection[collection._id];
    const collectionPathChanged = !_.isEqualWith(match, this.props.match, 'url');

    if (finishedLoading) {
      this.setState({ loading: false });
    } else if (collectionPathChanged) {
      const newCollection = _.find(store.collection.collections, {
        path: match.url
      });

      this.handleCollectionChange(newCollection);
    }
  }

  handleCollectionChange(newCollection) {
    if (!newCollection) return this.props.history.push('/404');

    this.setState({
      collection: newCollection
    });

    this.loadDocuments(newCollection._id);
  }

  loadDocuments(collectionId) {
    this.props.actions.loadDocumentsInCollection(collectionId);
    this.setState({ loading: true });
  }

  getView(view) {
    const views = {
      TABLE: {
        component: Table,
        props: {
          className: 'flex-view scroll'
        }
      }
    };

    return views[view] || views.TABLE;
  }

  openDocument(doc) {
    const { history } = this.props;
    const { path } = this.state.collection;

    return history.push({
      pathname: `${path}/${doc._id}`,
      state: { document: doc }
    });
  }

  render() {
    const { collection, loading }: IState = this.state;

    if (loading || !collection) {
      return <Loading />;
    }

    const { CollectionHeader, Placeholder }: any = getComponents(
      collection,
      this.props.store.documents.byCollection[collection._id]
    );

    const documents = this.props.store.documents.byCollection[collection._id];
    const handleSelectDocument: React.MouseEventHandler<any> = (doc: object) =>
      this.openDocument(doc);
    const { component: View, props: viewProps } = this.getView(
      collection.defaultView.type
    );

    return (
      <FlexColumn className="collection-view">
        <CollectionHeader />
        {_.isEmpty(documents) ? (
          <Placeholder />
        ) : (
          <div {...viewProps}>
            <View
              fields={collection.fields}
              records={documents}
              onSelectDocument={handleSelectDocument}
              pathname={location.pathname}
            />
          </div>
        )}
      </FlexColumn>
    );
  }
}

const Loading = () => (
  <Flex className="flex-view" justify="center">
    <div className="loader" />
  </Flex>
);

export default connect(CollectionView);
