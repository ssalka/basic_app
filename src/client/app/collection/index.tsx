declare const _;
declare const React;

import { Link } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { ViewComponent, Table, FlexColumn } from 'lib/client/components';
import { Collection, RouteProps, QueryProps } from 'lib/client/interfaces';
import getComponents from './components';
import 'lib/client/styles/CollectionView.less';

export interface Props extends RouteProps, QueryProps {
  collection: Collection;
  documents: any[];
  loading: boolean;
  store: any;
}

export interface State {
  documents: any[];
}

export default class CollectionView extends ViewComponent<Props, State> {
  static defaultProps = {
    collection: {},
    loading: true
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      documents: props.documents || []
    };
  }

  componentDidMount() {
    const { collection } = this.props;

    console.info(
      'User Collection', collection._id,
      _.omit(collection, '_id')
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    const { collection, store } = nextProps;
    if (!_.isEqual(nextProps.documents, this.state.documents)) {
      // TODO: warn if overwriting unsaved changes
      store.loadDocuments(nextProps.documents);
    }
  }

  getView(view) {
    const views = {
      TABLE: {
        component: Table,
        props: {
          className: 'flex-view scroll',
        }
      }
    };

    return views[view] || views['TABLE'];
  }

  openDocument(doc) {
    const { collection, history }: Partial<Props> = this.props;
    return history.push({
      pathname: `${collection.path}/${doc._id}`,
      state: { document: doc }
    });
  }

  render() {
    const { collection, loading, loadNextPage, location }: Partial<Props> = this.props;
    const { CollectionHeader, Loading, Placeholder } = getComponents(this.props, this.state);
    const noDocuments: boolean = _.isEmpty(this.state.documents);

    const {
      component: View,
      props: viewProps
    } = this.getView(collection.defaultView.type);

    return (
      <FlexColumn className="collection-view">
        <CollectionHeader />
        {loading ? <Loading /> : (
          noDocuments ? <Placeholder /> : (
            <div {...viewProps}>
              <div onClick={() => loadNextPage()}>Load Next Page</div>
              <View
                headers={_.map(collection.fields, 'name')}
                content={this.state.documents}
                onSelectDocument={doc => this.openDocument(doc)}
                pathname={location.pathname}
              />
            </div>
          )
        )}
      </FlexColumn>
    );
  }
}
