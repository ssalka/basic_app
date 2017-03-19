declare const _;
declare const React;

import { ViewComponent } from 'lib/client/components';
import { Field, IRenderMethod, ReactElement } from 'lib/client/interfaces';
import { RENDER_METHODS } from 'lib/common/constants';
import { Link } from 'react-router';

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

  private renderField(field: Field, index: number): ReactElement {
    const FieldComponent = {
      PLAIN_TEXT: (props: any) => <div {...props} />
    }[field.renderMethod || 'PLAIN_TEXT'];
    const renderMethod: IRenderMethod = _.find(RENDER_METHODS, { key: field.renderMethod }) || RENDER_METHODS[0];
    const fieldProps: any = {
      [renderMethod.targetProp]: this.props.document[_.camelCase(field.name)]
    };

    return <FieldComponent {...fieldProps} />;
  }

  public render() {
    const { document: _document } = this.props;
    const state = this.props;

    return (
      <ViewComponent>
        <Link to={{ pathname: `${location.pathname}/edit`, state }}>Edit Document</Link>
        <br /><br />
        {this.props.collection.fields
          .map(this.renderField)
          .map((renderedField) => (
            <p>{renderedField}</p>
          ))}
      </ViewComponent>
    );
  }
}
