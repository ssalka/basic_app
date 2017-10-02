declare const _;
declare const React;
import { ReactElement } from '../interfaces';

interface IProps extends React.Props<any> {
  intent?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  rounded?: boolean;
  size?: string;
  className?: string;
  value: string;
  onChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}

export default ({ intent, rounded, size, ...props }: IProps): ReactElement => {
  const classNameList: string[] = _.compact(['pt-input', props.className]);

  if (intent) {
    classNameList.push(`pt-intent-${intent}`);
  }
  if (rounded) {
    classNameList.push('pt-round');
  }
  if (size) {
    classNameList.push(`pt-${size}`);
  }

  const className = classNameList.join(' ');

  return (
    <input
      type="text"
      dir="auto"
      className={className}
      {...props}
    />
  );
};
