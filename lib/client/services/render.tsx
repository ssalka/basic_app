declare const _;
declare const React;
import Rating = require('react-rating');
import { RENDER_METHODS } from 'lib/common/constants';
import {
  Field,
  IComponentModule,
  IRenderMethod,
  ReactElement,
  ReactProps,
  SFC
} from 'lib/client/interfaces';

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
    }
    else {
      evaluator = _.overSome([
        _.identity,
        _.isNumber
      ]);
    }

    return evaluator(val);
  }

  private getProps(document: any, field: Field): ReactProps {
    const { targetProp }: IRenderMethod = _.find(RENDER_METHODS, {
      key: field.renderMethod || 'PLAIN_TEXT'
    });
    const rawValue: any = _.get(document, _.camelCase(field.name));
    const displayValue = field.isArray && field.renderMethod === 'PLAIN_TEXT'
      ? rawValue.join(', ')
      : rawValue;

    return { [targetProp]: displayValue };
  }

  public renderField(document: any, field: Field, props: ReactProps = {}): ReactElement {
    const renderMethod: string = field.renderMethod || 'PLAIN_TEXT';
    const Component: SFC = this.componentMap[renderMethod];

    return (
      <Component
        {...props}
        {...this.getProps(document, field)}
      />
    );
  }
}

export default new RenderingService();
