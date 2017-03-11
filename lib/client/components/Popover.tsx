declare const React;
import { ViewComponent } from './';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

export default class extends ViewComponent<any, any> {
  public static defaultProps = {
    className: ''
  };

  private getPosition(key: string) {
    return {
      top: Position.TOP,
      bottom: Position.BOTTOM,
      left: Position.LEFT,
      right: Position.RIGHT
    }[key];
  }

  public render() {
    const {
      getPosition,
      props: { target, position, children, isOpen, className }
    } = this;

    return (
      <Popover
        content={children}
        isOpen={isOpen}
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName={`pt-popover-content-sizing ${className}`.trim()}
        position={getPosition(position)}
        useSmartPositioning={false}
        children={target}
      />
    );
  }
}
