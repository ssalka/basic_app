declare const _;
declare const React;

import { ViewComponent } from 'lib/client/components';
import { Link } from 'react-router';

export default class DocumentView extends ViewComponent<any, any> {
  public static defaultProps = {
    collection: {},
    document: {},
    pathname: ''
  };

  private componentDidMount() {
    const { document: _document } = this.props;
    console.info(
      _.singularize(_document.__typename), _document._id,
      _.omit(_document, '_id')
    );
  }

  public render() {
    const { document: _document } = this.props;
    const state = this.props;

    return (
      <ViewComponent>
        Document view for {_document._id}
        <Link to={{ pathname: `${location.pathname}/edit`, state }}>Edit Document</Link>
      </ViewComponent>
    );
  }
}
