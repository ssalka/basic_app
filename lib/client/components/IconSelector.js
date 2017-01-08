import _ from 'lodash';
import React from 'react';
import { ViewComponent, Icon, Popover, FlexRow } from '../components';
import { ICONS } from 'lib/common/constants';
import '../styles/IconSelector.less';

class IconSelector extends ViewComponent {
  state = {
    editing: false,
    icon: 'graph'
  };

  SelectedIcon() {
    return (
      <Icon name={this.state.icon} />
    );
  }

  setIcon(icon) {
    this.setState({ icon });
    this.props.onSelectIcon(icon);
  }

  IconGrid({ name, icons }) {
    return (
      <div key={name} className="icon-grid">
        <h5>{_.capitalize(name)}</h5>
        <FlexRow wrap={true} justifyContent="flex-start">
          {icons.map(icon => (
            <Icon name={icon.id} onClick={() => this.setIcon(icon.id)} />
          ))}
        </FlexRow>
      </div>
    );
  }

  IconGroups() {
    const { IconGrid } = this;
    return (
      <div className="scroll-y" style={{ maxHeight: '300px', maxWidth: '250px' }}>
        {_(ICONS)
          .groupBy('group')
          .map((icons, group) => ({ name: group, icons }))
          .sortBy('name')
          .map(props => (
            <IconGrid {...props} />
          ))
          .value()}
      </div>
    );
  }

  render() {
    const { SelectedIcon, IconGroups, props } = this;

    return (
      <Popover target={<SelectedIcon />}
        isOpenn={props.selectingIcon}
        position="bottom"
      >
        <h4>Select an Icon</h4>
        <IconGroups />
      </Popover>
    )
  }
}

module.exports = IconSelector;
