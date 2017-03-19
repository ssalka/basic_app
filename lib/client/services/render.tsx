declare const _;
declare const React;
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
    PLAIN_TEXT: (props: ReactProps) => <span {...props} />
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
    const fieldValue: any = _.get(document, _.camelCase(field.name));

    return { [targetProp]: fieldValue };
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
