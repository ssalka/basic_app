import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { DragSource } from 'react-dnd';
import { Flex } from 'grid-styled';
import { getName } from 'lib/common/helpers';
import { ICSSProps } from 'lib/common/interfaces';
import '../styles/Tag.less';

interface ITagProps {
  onRemove?(event): void;
  removable?: boolean;
}

const Tag: React.ComponentType<ITagProps & React.HTMLProps<HTMLSpanElement>> = ({
  children,
  className,
  onRemove,
  removable,
  ...props
}) => (
  <span
    className={classNames('pt-tag', removable && 'pt-tag-removable', className)}
    {...props}
  >
    {getName(children as any)}
    {removable && <button className="pt-tag-remove" onClick={onRemove} />}
  </span>
);

export default Tag;

const tagSource = {
  isDragging: (props, monitor) => monitor.getItem().id === props.id,

  beginDrag: props => props.children,

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) return;

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
  }
};

const DraggableTag = DragSource('DraggableTag', tagSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(({ className, isDragging, connectDragSource, ...props }) =>
  connectDragSource(
    <div>
      <Tag className={classNames(className, isDragging && 'dragging')} {...props} />
    </div>
  )
);

interface ITagListProps extends React.HTMLProps<HTMLDivElement>, ICSSProps {
  onRemoveIndex?(index: number): void;
  tags: any[];
  removable?: boolean;
  draggable?: boolean;
}

export const TagList: React.ComponentType<ITagListProps> = ({
  onRemoveIndex = _.noop,
  tags = [],
  className = '',
  removable = false,
  draggable = false,
  ...props
}) => {
  const Component = draggable ? DraggableTag : Tag;

  return (
    <Flex
      wrap="wrap"
      align="flex-start"
      className={classNames('tag-list', className)}
      {...props}
    >
      {tags
        .map((tag, i) => ({
          children: tag,
          removable,
          onRemove: event => onRemoveIndex(i),
          id: i
        }))
        .map((tagProps, i) => <Component key={i} {...tagProps} />)}
    </Flex>
  );
};
