import { Button } from '@blueprintjs/core';
import '../styles/Button.less';

module.exports = (props) => {
  const className = getClassName(props);
  const { type, onClick, children, text } = props;
  return (
    <Button {..._.pickBy({
      type,
      className,
      onClick
    })}>{text || children}</Button>
  );
};

function getClassName({
  className,
  icon,
  size,
  rounded,
  color,
  minimal,
  disabled
}) {
  const classNameList = ['btn'];

  if (className) classNameList.push(className);
  if (icon) classNameList.push(`icon pt-icon-${icon}`);
  if (size) classNameList.push(`pt-${size}`);
  if (rounded) classNameList.push('rounded');
  if (color) classNameList.push(`pt-intent-${color}`);
  if (minimal) classNameList.push('pt-minimal');
  if (disabled) classNameList.push('pt-disabled');

  return classNameList.join(' ');
}
