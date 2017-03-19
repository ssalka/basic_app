declare const _;
declare const React;

import { ViewComponent } from 'lib/client/components';
import { Field, IRenderMethod, ReactElement, SFC } from 'lib/client/interfaces';
import { RENDER_METHODS } from 'lib/common/constants';
import { Link } from 'react-router';
import { RenderingService } from 'lib/client/services';

export default class DocumentView extends ViewComponent<any, any> {
  public static defaultProps = {
    collection: {},
    document: {},
    pathname: ''
  };

  private componentDidMount() {
    const { collection, document: _document } = this.props;
    console.info(
      _.singularize(_document.__typename), _document._id,
      _.omit(_document, '_id')
    );
  }

  private renderField: SFC = (field: Field): ReactElement => (
    <p>
      {RenderingService.renderField(this.props.document, field)}
    </p>
  )

  public render() {
    const { collection, document: _document } = this.props;
    const state = this.props;

    return (
      <ViewComponent>
        <Link to={{ pathname: `${location.pathname}/edit`, state }}>Edit Document</Link>
        <br /><br />
        {collection.fields.map(this.renderField)}
      </ViewComponent>
    );
  }
}
