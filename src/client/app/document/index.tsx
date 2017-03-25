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
  IGraphQLDocument,
  IRenderMethod,
  ReactElement,
  SFC
} from 'lib/client/interfaces';
import './styles.less';

interface IProps {
  collection: Collection;
  document: IDocument & IGraphQLDocument;
  pathname: string;
}

export default class DocumentView extends ViewComponent<IProps, any> {
  public static defaultProps: IProps = {
    collection: new Collection(),
    document: {} as IDocument & IGraphQLDocument,
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
      <strong className="field-name">
        {field.name}
      </strong>
      {RenderingService.renderField(this.props.document, field)}
    </p>
  )

  public render() {
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
