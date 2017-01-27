import { Link } from 'react-router';
import { ViewComponent, Table, Icon, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/CollectionView.less';

class CollectionView extends ViewComponent {
  constructor(props) {
    super(props);
    console.info(
      'User Collection', props.collection._id,
      _.omit(props.collection, '_id')
    );
  }
  static defaultProps = {
    collection: {},
    documents: []
  };

  get collection() {
    return this.props.collection;
  }

  get documents() {
    const { creator, _collection } = this.collection;
    const collectionName = [creator.username, _collection].join('_');
    return _.get(this.props, collectionName, []);
  }

  render() {
    const { collection, documents } = this;
    const headers = _.map(collection.fields, 'name');
    const View = _.get({
      TABLE: Table
    }, collection.defaultView, Table);
    return (
      <FlexColumn className="collection-view">
        <FlexRow justifyContent="flex-start" alignItems="center">
          <Icon name={collection.icon} size={22} />
          <h3>{collection.name}</h3>
        </FlexRow>
        {documents.length ? (
          <div className="flex-view">
            <View content={documents} headers={headers} />
          </div>
        ) : (
          <NonIdealState
            visual={collection.icon || 'document'}
            title={`You don't have any ${collection.name}`}
            description={<span>All {collection.name.toLowerCase()} you add will be visible here</span>}
            action={(
              <Link to={`collections${collection.path}/add`}>
                <Button icon="add"
                  text={`Add ${_.singularize(collection.name)}`}
                  minimal={true}
                  rounded={true}
                  color="primary"
                />
              </Link>
            )}
          />
        )}
      </FlexColumn>
    );
  }
}

module.exports = CollectionView;
