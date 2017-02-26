import { Link } from 'react-router';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

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

  get components() {
    const {
      props: { collection, location: _location },
      state: { documents }
    } = this;

    const { name, description, icon, path } = collection;

    const linkWithState = pathname => ({
      pathname, state: { collection }
    });

    const SettingsButton = () => (
      <Link to={linkWithState(`${path}/edit`)}>
        <Button icon="cog" minimal={true} size="small" />
      </Link>
    );

    const AddDocumentButton = overrides => (
      <Link to={linkWithState(`${_location.pathname}/add`)}>
        <Button icon="add" text={`Add ${_.singularize(name)}`}
          color="primary"
          minimal={true}
          rounded={true}
          {...overrides}
        />
      </Link>
    );

    return {
      CollectionHeader: () => (
        <FlexRow alignItems="top">
          <div className="collection-info">
            <p><h3>{name}</h3> <h3 className="muted">({documents.length})</h3></p>
            {description && <p>{description}</p>}
            <AddDocumentButton size="small" />
            <SettingsButton />
          </div>
          <Icon className="faded" name={icon} size={60} />
        </FlexRow>
      ),
      Placeholder: () => (
        <NonIdealState
          visual={icon || 'document'}
          title={`You don't have any ${name}`}
          description={<span>All {name.toLowerCase()} you add will be visible here</span>}
          action={<AddDocumentButton />}
        />
      ),
      Loading: () => (
        <FlexRow className="flex-view" justifyContent="center">
          <div className="loader"></div>
        </FlexRow>
      )
    };
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
    const {
      getView, props,
      state: { documents },
      components: { CollectionHeader, Loading, Placeholder }
    } = this;

    const {
      component: View,
      props: viewProps
    } = getView(props.collection.defaultView.type);

    const DocumentsOrPlaceholder = () => _.isEmpty(documents) ? (
      <Placeholder />
    ) : (
      <div {...viewProps}>
        <div onClick={props.loadNextPage}>Load Next Page</div>
        <View
          headers={_.map(props.collection.fields, 'name')}
          content={documents}
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
