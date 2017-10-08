declare const _;
declare const React;
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { ViewComponent } from 'lib/client/components';
import { IRenderMethod } from 'lib/common/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';

interface IProps {
  renderMethods: IRenderMethod[];
  selectedView?: IRenderMethod;
  onSelectView?(renderMethod: IRenderMethod): void;
}

export default class ViewSelect extends ViewComponent<IProps, {}> {
  public static defaultProps: IProps = {
    renderMethods: [],
    onSelectView: _.noop
  };

  public render() {
    const selectView = (renderMethod: IRenderMethod) => () =>
      this.props.onSelectView(renderMethod);

    return (
      <Menu>
        {this.props.renderMethods.map((renderMethod: IRenderMethod) => (
          <MenuItem
            className={
              _.isEqual(renderMethod, this.props.selectedView) &&
              'pt-active pt-intent-primary'
            }
            iconName="new-text-box"
            onClick={selectView(renderMethod)}
            text={renderMethod.name}
          />
        ))}
      </Menu>
    );
  }
}
