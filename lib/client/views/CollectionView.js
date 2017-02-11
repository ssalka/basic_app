import { Link } from 'react-router';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

class CollectionView extends ViewComponent {
  static defaultProps = {
    collection: {},
    documents: []
  };

  componentDidMount() {
    const { collection } = this.props;
    console.info(
      'User Collection', collection._id,
      _.omit(collection, '_id')
    );
  }

  get collection() {
    return this.props.collection;
  }

  get documents() {
    const { creator, _collection } = this.collection;
    const collectionName = [creator.username, _collection].join('_');
    return _.get(this.props, collectionName, []);
  }

  get components() {
    const { documents } = this;

    const SettingsButton = ({ collection }) => (
      <Link to={{ pathname: `/collections${collection.path}/edit`, state: { collection } }}>
        <Button icon="cog" minimal={true} size="small" />
      </Link>
    );

    const AddDocumentButton = ({ name, path }) => (
      <Link to={`collections${path}/add`}>
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
      Placeholder: ({ collection: { icon, name, path } }) => (
        <NonIdealState
          visual={icon || 'document'}
          title={`You don't have any ${name}`}
          description={<span>All {name.toLowerCase()} you add will be visible here</span>}
          action={<AddDocumentButton name={name} path={path} />}
        />
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

  render() {
    const {
      getView, collection, documents,
      components: { CollectionHeader, Placeholder }
    } = this;
    const {
      component: View,
      props: viewProps
    } = getView(collection.defaultView.type);

    return (
      <FlexColumn className="collection-view">
        <CollectionHeader collection={collection} />
        {documents.length ? (
          <div {...viewProps}>
            <View
              content={documents}
              headers={_.map(collection.fields, 'name')}
            />
          </div>
        ) : (
          <Placeholder collection={collection} />
        )}
      </FlexColumn>
    );
  }
}

module.exports = CollectionView;
