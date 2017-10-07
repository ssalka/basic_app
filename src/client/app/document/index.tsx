declare const _;
declare const React;

import { ViewComponent } from 'lib/client/components';
import { RENDER_METHODS } from 'lib/common/constants';
import { Link } from 'react-router';
import { RenderingService } from 'lib/client/services';
import {
  Collection,
  Field,
  IDocument,
  IRenderMethod,
  ReactElement,
  ReactProps,
  SFC
} from 'lib/common/interfaces';
import './styles.less';

interface IProps extends ReactProps {
  collection: Collection;
  document: IDocument;
  pathname: string;
}

export default class DocumentView extends ViewComponent<IProps, any> {
  static defaultProps: IProps = {
    collection: new Collection(),
    document: {} as IDocument,
    pathname: ''
  };

  componentDidMount() {
    const { collection, document: _document } = this.props;
    console.info(
      _.singularize(collection.name), _document._id,
      _.omit(_document, '_id')
    );
  }

  renderField: SFC = (field: Field): ReactElement => (
    <p>
      <strong className="field-name">
        {field.name}
      </strong>
      {RenderingService.renderField(this.props.document, field)}
    </p>
  )

  render() {
    const { collection, document: _document } = this.props;
    const state = this.props;

    return (
      <ViewComponent className="document-view">
        <Link to={{ pathname: `${location.pathname}/edit`, state }}>Edit Document</Link>
        <br /><br />
        {collection.fields
          .filter((field: Field) => (
            RenderingService.isNonemptyField(
              _document[_.camelCase(field.name)]
            )
          ))
          .map(this.renderField)}
      </ViewComponent>
    );
  }
}
