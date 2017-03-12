declare const _;
declare const React;
import { ViewComponent, Icon, Popover, FlexRow } from '../';
import { IIcon, ReactProps } from 'lib/client/interfaces';
import { ICONS } from 'lib/common/constants';
import '../../styles/IconSelector.less';

interface IProps extends ReactProps {
  selected: string;
  onSelectIcon: (iconId: string) => void;
  onClick: React.MouseEventHandler<any>;
  isOpen: boolean;
}

interface IState { icon: string; }

export default class IconSelector extends ViewComponent<IProps, IState> {
  public static defaultProps = {
    selected: 'graph'
  };

  constructor(props: IProps) {
    super(props);
    this.state = { icon: props.selected };
  }

  private SelectedIcon() {
    return (
      <Icon name={this.state.icon} onClick={this.props.onClick} />
    );
  }

  private setIcon(icon: IIcon) {
    this.setState({ icon: icon.id });
    this.props.onSelectIcon(icon.id);
  }

  private IconGrid({ name, icons }) {
    const getIconSetter: (icon: IIcon) => React.MouseEventHandler<HTMLSpanElement> = (
      (icon: IIcon) => () => this.setIcon(icon)
    );

    return (
      <div key={name} className="icon-grid">
        <h5>{_.capitalize(name)}</h5>
        <FlexRow justifyContent="flex-start" flexWrap={true}>
          {icons.map((icon: any) => (
            <Icon name={icon.id} onClick={getIconSetter(icon)} />
          ))}
        </FlexRow>
      </div>
    );
  }

  private IconGroups() {
    const { IconGrid } = this;
    return (
      <div className="scroll-y" style={{ maxHeight: '300px', maxWidth: '250px' }}>
        {_(ICONS)
          .groupBy('group')
          .map((icons, group) => ({ name: group, icons }))
          .sortBy('name')
          .map(IconGrid)
          .value()}
      </div>
    );
  }

  public render() {
    const {
      SelectedIcon, IconGroups,
      props: { isOpen }
    } = this;

    return (
      <Popover
        target={<SelectedIcon />}
        isOpen={isOpen}
        position="bottom"
      >
        <h4>Select an Icon</h4>
        <IconGroups />
      </Popover>
    );
  }
}
