import * as lodash from 'lodash';
import * as inflection from 'lodash-inflection';
import * as React from 'react';
const _: any = lodash.mixin(inflection);

import { ViewComponent } from 'lib/client/components';
import Link from 'react-router-redux-dom-link';
import { RenderingService } from 'lib/client/services';
import {
  Collection,
  CollectionField,
  IDocument,
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
    console.info(_.singularize(collection.name), _document._id, _.omit(_document, '_id'));
  }

  renderField: SFC = (field: CollectionField): ReactElement => (
    <p key={field.name}>
      <strong className="field-name">{field.name}</strong>
      {RenderingService.renderCollectionField(this.props.document, field)}
    </p>
  );

  render() {
    const { collection, document: _document } = this.props;
    const state = this.props;

    return (
      <ViewComponent className="document-view">
        <Link to={{ pathname: `${location.pathname}/edit`, state }}>Edit Document</Link>
        <br />
        <br />
        {collection.fields
          .filter((field: CollectionField) =>
            RenderingService.isNonemptyField(_document[_.camelCase(field.name)])
          )
          .map(this.renderField)}
      </ViewComponent>
    );
  }
}
