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
    PLAIN_TEXT: (props: ReactProps) => <div {...props} />
  };

  private getProps(document: any, field: Field): ReactProps {
    const { targetProp }: IRenderMethod = _.find(RENDER_METHODS, {
      key: field.renderMethod || 'PLAIN_TEXT'
    });
    const fieldValue: any = _.get(document, _.camelCase(field.name));

    return { [targetProp]: fieldValue };
  }

  public renderField(document: any, field: Field): ReactElement {
    const renderMethod: string = field.renderMethod || 'PLAIN_TEXT';
    const Component: SFC = this.componentMap[renderMethod];
    const props: ReactProps = this.getProps(document, field);

    return <Component {...props} />;
  }
}

export default new RenderingService();
