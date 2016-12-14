import { Button } from '@blueprintjs/core';
import '../styles/Button.less';

module.exports = props => {
  const { icon, size, rounded, color, minimal } = props;
  const classNames = ['btn'];

  if (icon) classNames.push(`pt-icon-${icon}`);
  if (size) classNames.push(`pt-${size}`);
  if (rounded) classNames.push('rounded');
  if (color) classNames.push(`pt-intent-${color}`);
  if (minimal) classNames.push('pt-minimal');
  return (
    <Button className={classNames.join(' ')} {
      ..._.pick(props, ['children', 'onClick'])
    }></Button>
  );
};
