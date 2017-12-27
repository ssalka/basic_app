import * as classNames from 'classnames';
import * as React from 'react';
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
        content={children as JSX.Element}
        isOpen={isOpen}
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName={classNames('pt-popover-content-sizing', className)}
        position={getPosition(position)}
        useSmartPositioning={false}
        children={target}
      />
    );
  }
}
