import { Link } from 'react-router';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {},
    documents: [],
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

    const SettingsButton = ({ collection }) => (
      <Link to={{ pathname: `${collection.path}/edit`, state: { collection } }}>
        <Button icon="cog" minimal={true} size="small" />
      </Link>
    );

    const AddDocumentButton = ({ name }) => (
      <Link to={`/${props.location.pathname}/add`}>
        <Button icon="add" text={`Add ${_.singularize(name)}`}
          color="primary"
          minimal={true}
          rounded={true}
        />
      </Link>
    );

    return {
      CollectionHeader: ({ collection }) => (
        <FlexRow alignItems="top">
          <div className="collection-info">
            <h3>{collection.name}</h3> <h3 className="muted">({documents.length})</h3>
            {collection.description && <div>{collection.description}</div>}
            <SettingsButton collection={collection} />
          </div>
          <Icon className="faded" name={collection.icon} size={60} />
        </FlexRow>
      ),
      Placeholder: ({ collection: { icon, name } }) => (
        <NonIdealState
          visual={icon || 'document'}
          title={`You don't have any ${name}`}
          description={<span>All {name.toLowerCase()} you add will be visible here</span>}
          action={<AddDocumentButton name={name} />}
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
      <Placeholder collection={props.collection} />
    ) : (
      <div {...viewProps}>
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
        <CollectionHeader collection={props.collection} />
        {props.loading ? <Loading /> : <DocumentsOrPlaceholder />}
      </FlexColumn>
    );
  }
}

module.exports = CollectionView;
