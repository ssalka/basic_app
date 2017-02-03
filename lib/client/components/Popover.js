import { ViewComponent } from './';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

class _Popover extends ViewComponent {
  getPosition(key) {
    return {
      top: Position.TOP,
      bottom: Position.BOTTOM,
      left: Position.LEFT,
      right: Position.RIGHT
    }[key];
  }

  toggle() {
    this._toggle('isOpen');
  }

  render() {
    const {
      getPosition, toggle,
      props: { target, position, children, isOpen }
    } = this;

    return (
      <Popover content={children} isOpen={isOpen}
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName="pt-popover-content-sizing"
        position={getPosition(position)}
        useSmartPositioning={false}
        children={target}
      />
    );
  }
}

module.exports = _Popover;
