import { ViewComponent, SchemaForm } from '../components';

class AddCollectionView extends ViewComponent {
  render() {
    const { collection } = this.props.location.state || {};
    return (
      <ViewComponent>
        <SchemaForm collection={collection} />
      </ViewComponent>
    );
  }
}

module.exports = AddCollectionView;
