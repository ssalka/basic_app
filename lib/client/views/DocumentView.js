import { ViewComponent } from 'lib/client/components';

class DocumentView extends ViewComponent {
  static defaultProps = {
    document: { _id: null }
  };

  render() {
    const { document } = this.props;

    return (
      <ViewComponent>
        Document view for {document._id}
      </ViewComponent>
    );
  }
}

module.exports = DocumentView;
