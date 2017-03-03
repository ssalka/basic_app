import { Link } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { ViewComponent, Table, FlexColumn } from 'lib/client/components';
import getComponents from './components';
import 'lib/client/styles/CollectionView.less';

class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {},
    loading: true
  };

  constructor(props) {
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

  componentWillReceiveProps(nextProps) {
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
    const { collection } = this.props;
    return this.props.history.push({
      pathname: `${collection.path}/${doc._id}`,
      state: { document: doc }
    });
  }

  render() {
    const { getView, props, state } = this;
    const { CollectionHeader, Loading, Placeholder } = getComponents(props, state);

    const {
      component: View,
      props: viewProps
    } = getView(props.collection.defaultView.type);

    const DocumentsOrPlaceholder = () => _.isEmpty(state.documents) ? (
      <Placeholder />
    ) : (
      <div {...viewProps}>
        <div onClick={props.loadNextPage}>Load Next Page</div>
        <View
          headers={_.map(props.collection.fields, 'name')}
          content={state.documents}
          onSelectDocument={doc => this.openDocument(doc)}
          pathname={props.location.pathname}
        />
      </div>
    );

    return (
      <FlexColumn className="collection-view">
        <CollectionHeader />
        {props.loading ? <Loading /> : <DocumentsOrPlaceholder />}
      </FlexColumn>
    );
  }
}

module.exports = CollectionView;
