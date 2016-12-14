import { Button } from '@blueprintjs/core';
import _ from 'lodash';
import '../styles/Button.less';

module.exports = ({ size, rounded, color, minimal, children }) => {
  const classNames = [];
  if (size) classNames.push(`btn-${size}`);
  if (rounded) classNames.push('rounded');
  if (color) classNames.push(`pt-intent-${color}`);
  if (minimal) classNames.push('pt-minimal');

  return (
    <Button className={classNames.join(' ')}>
      {children}
    </Button>
  );
};
