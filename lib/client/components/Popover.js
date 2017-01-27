import { ViewComponent } from '../components';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

class _Popover extends ViewComponent {
  state = {
    isOpen: false
  };

  getPosition(key) {
    return {
      top: Position.TOP,
      bottom: Position.BOTTOM,
      left: Position.LEFT,
      right: Position.RIGHT,
    }[key];
  }

  render() {
    const { isOpen, target, position, children } = this.props;

    return (
      <Popover isOpen={isOpen} content={children}
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName="pt-popover-content-sizing"
        position={this.getPosition(position)}
        useSmartPositioning={false}
        children={target}
      />
    );
  }
}

module.exports = _Popover;
