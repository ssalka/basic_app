import { Link } from 'react-router';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {},
    loading: true
  };

  componentDidMount() {
    const { collection } = this.props;
    console.info(
      'User Collection', collection._id,
      _.omit(collection, '_id')
    );
  }

  get documents() {
    const { _collection } = this.props.collection;
    return _.get(this.props, _collection, []);
  }

  get components() {
    const { documents, props } = this;
    const { name, description, icon, path } = props.collection;
    const state = { collection: props.collection };

    const SettingsButton = () => (
      <Link to={{ pathname: `${path}/edit`, state }}>
        <Button icon="cog" minimal={true} size="small" />
      </Link>
    );

    const AddDocumentButton = () => (
      <Link to={{ pathname: `${props.location.pathname}/add`, state }}>
        <Button icon="add" text={`Add ${_.singularize(name)}`}
          color="primary"
          minimal={true}
          rounded={true}
        />
      </Link>
    );

    return {
      CollectionHeader: () => (
        <FlexRow alignItems="top">
          <div className="collection-info">
            <h3>{name}</h3> <h3 className="muted">({documents.length})</h3>
            {description && <div>{description}</div>}
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
      getView, documents, props,
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
