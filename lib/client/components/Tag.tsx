import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { ICSSProps } from 'lib/common/interfaces';

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
    {children}
    {removable && <button className="pt-tag-remove" onClick={onRemove} />}
  </span>
);

export default Tag;

interface ITagListProps extends React.HTMLProps<HTMLDivElement>, ICSSProps {
  onRemoveIndex?(index: number): void;
  tags: string[];
}

export const TagList: React.ComponentType<ITagListProps> = ({
  onRemoveIndex = _.noop,
  tags = [],
  ...props
}) => (
  <Flex wrap="wrap" {...props}>
    {tags
      .map((tag, i) => ({ children: tag, onRemove: event => onRemoveIndex(i) }))
      .map((tagProps, i) => <Tag key={i} {...tagProps} />)}
  </Flex>
);
