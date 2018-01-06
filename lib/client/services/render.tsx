import * as _ from 'lodash';
import * as React from 'react';
import * as Rating from 'react-rating';
import { RENDER_METHODS } from 'lib/common/constants';
import {
  CollectionField,
  IComponentModule,
  IDocument,
  IRenderMethod,
  ReactElement,
  ReactProps,
  SFC
} from 'lib/common/interfaces';

class RenderingService {
  private componentMap: IComponentModule = {
    PLAIN_TEXT: (props: ReactProps) => <span {...props} />,
    RATING: (props: ReactProps) => (
      // TODO: make half-star ratings on 0-5 scale work
      <Rating
        step={0.5}
        fractions={2}
        empty="pt-icon-star-empty"
        full="pt-icon-star"
        readonly={true}
        {...props}
      />
    )
  };

  public isNonemptyField = (val: any): boolean => {
    let evaluator: (val: any) => boolean;

    if (_.isArray(val)) {
      evaluator = _.overEvery([
        _.negate(_.isEmpty),
        () => _.some(val, this.isNonemptyField)
      ]);
    } else {
      evaluator = _.overSome([_.identity, _.isNumber]);
    }

    return evaluator(val);
  };

  private getProps(document: IDocument, field: CollectionField): ReactProps {
    const { targetProp }: IRenderMethod = _.find(RENDER_METHODS, {
      key: field.renderMethod || 'PLAIN_TEXT'
    });
    const rawValue: IDocument | IDocument[] = _.get(document, _.camelCase(field.name));
    const isPlainTextArrayField: boolean =
      field.isArray && (!field.renderMethod || field.renderMethod === 'PLAIN_TEXT');
    const displayValue = isPlainTextArrayField
      ? (rawValue as IDocument[]).join(', ')
      : rawValue;

    return { [targetProp]: displayValue };
  }

  public renderCollectionField(
    document: any,
    field: CollectionField,
    props: ReactProps = {}
  ): ReactElement {
    const renderMethod: string = field.renderMethod || 'PLAIN_TEXT';
    const Component: SFC = this.componentMap[renderMethod];

    return <Component {...props} {...this.getProps(document, field)} />;
  }
}

export default new RenderingService();
