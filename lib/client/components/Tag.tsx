import * as classNames from 'classnames';
import * as React from 'react';

interface ITagProps {
  onRemove?(): void;
  removable?: boolean;
}

const Tag: React.ComponentType<ITagProps> = ({
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
