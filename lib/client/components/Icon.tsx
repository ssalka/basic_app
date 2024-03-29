import * as classNames from 'classnames';
import * as React from 'react';
import { ReactElement } from 'lib/common/interfaces';

interface IProps extends React.Props<any> {
  name: string;
  size?: number;
  className?: string;
  onClick?: React.MouseEventHandler<any>;
}

export default ({ name, size = 20, className, ...props }: IProps): ReactElement => (
  <span
    className={classNames(className, 'icon', `pt-icon-${name}`)}
    style={{ fontSize: size }}
    {...props}
  />
);
