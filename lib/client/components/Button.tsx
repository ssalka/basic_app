declare const _;
declare const React;
import { Button, IButtonProps } from '@blueprintjs/core';
import { ReactElement } from '../interfaces';
import '../styles/Button.less';

interface IProps extends React.Props<any> {
  className?: string;
  icon?: string;
  size?: string;
  rounded?: boolean;
  color?: string;
  minimal?: boolean;
  disabled?: boolean;
  text?: string;
  type?: string;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

export default (props: IProps): ReactElement => {
  const className: string = getClassName(props);
  const { type, onClick, children, text }: Partial<IProps> = props;
  const buttonProps: IButtonProps = _.pickBy(
    { type, className, onClick }
  );

  return (
    <Button {...buttonProps}>{text || children}</Button>
  );
};

function getClassName({
  className,
  icon,
  size,
  rounded,
  color,
  minimal,
  disabled,
  text,
  children
}: IProps): string {
  const classNameList: string[] = ['btn'];

  if (className) {
    classNameList.push(className);
  }
  if (icon) {
    classNameList.push(`icon pt-icon-${icon}`);
  }
  if (size) {
    classNameList.push(`pt-${size}`);
  }
  if (rounded || (icon && !(text || children))) {
    classNameList.push('rounded');
  }
  if (color) {
    classNameList.push(`pt-intent-${color}`);
  }
  if (minimal) {
    classNameList.push('pt-minimal');
  }
  if (disabled) {
    classNameList.push('pt-disabled');
  }

  return classNameList.join(' ');
}
