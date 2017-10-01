declare const _;
declare const React;

import { findDOMNode } from 'react-dom';
import Icon from 'material-ui/Icon';
import Popover from 'material-ui/Popover';
import { ViewComponent, FlexRow } from '../';
import { IIcon, ReactElement, ReactProps } from 'lib/client/interfaces';
import { ICONS } from 'lib/common/constants';
import '../../styles/IconSelector.less';

interface IProps extends ReactProps {
  selectedIcon: string;
  onSelectIcon(iconId: string): void;
}

interface IState {
  anchorElement: any;
  icon: string;
  open: boolean;
}

export default class IconSelector extends ViewComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    selectedIcon: 'graph'
  };

  selectedIconRef = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      anchorElement: null,
      icon: props.selectedIcon,
      open: false
    };
  }

  handleRequestClose = () => this.setState({
    open: false
  })

  handleTargetClick = () => this.setState({
    open: true,
    anchorElement: findDOMNode(this.selectedIconRef)
  })

  setIcon(icon: IIcon) {
    this.setState({ icon: icon.id });
    this.props.onSelectIcon(icon.id);
  }

  IconGrid({ name, icons }): ReactElement {
    const getIconSetter: (icon: IIcon) => React.MouseEventHandler<HTMLSpanElement> = (
      (icon: IIcon) => () => {
        this.setIcon(icon);
        this.handleRequestClose();
      }
    );

    return (
      <div key={name} className="icon-grid" style={{ marginLeft: 20 }}>
        <h5>{_.capitalize(name)}</h5>
        <FlexRow justifyContent="flex-start" flexWrap={true}>
          {icons.map((icon: IIcon) => (
            <Icon
              className={`pt-icon pt-icon-${icon.id}`}
              style={{ fontSize: 20, margin: 10 }}
              onClick={getIconSetter(icon)}
            />
          ))}
        </FlexRow>
      </div>
    );
  }

  setRef = node => {
    this.selectedIconRef = node;
  }

  IconGroups(): ReactElement {
    const { IconGrid } = this;

    return (
      <div className="scroll-y" style={{ maxHeight: 300, maxWidth: 250 }}>
        {_(ICONS)
          .groupBy('group')
          .map((icons: IIcon[], group: string): {} => ({ name: group, icons }))
          .sortBy('name')
          .map(IconGrid)
          .value()}
      </div>
    );
  }

  render() {
    const { IconGroups } = this;

    return (
      <div>
        <Icon
          className={`pt-icon pt-icon-${this.state.icon}`}
          style={{ fontSize: 20 }}
          ref={this.setRef}
          onClick={this.handleTargetClick}
        />

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorElement}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <h4 style={{ margin: 20 }}>
            Select an Icon
          </h4>
          <IconGroups />
        </Popover>
      </div>
    );
  }
}
