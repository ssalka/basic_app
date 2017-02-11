import { ViewComponent } from 'lib/client/components';
import { Link } from 'react-router';

class DocumentView extends ViewComponent {
  static defaultProps = {
    document: { _id: null },
    pathname: ''
  };

  render() {
    const { document } = this.props;

    return (
      <ViewComponent>
        Document view for {document._id}
        <Link to={{ pathname: `${location.pathname}/edit`, state: { document } }}>Edit Document</Link>
      </ViewComponent>
    );
  }
}

module.exports = DocumentView;
