declare const React;
import { NumericInput, INumericInputProps } from '@blueprintjs/core';
import { ReactElement } from '../interfaces';

export default ({ onChange, ...props }): ReactElement => (
  <NumericInput onValueChange={onChange} {...props as INumericInputProps} />
);
