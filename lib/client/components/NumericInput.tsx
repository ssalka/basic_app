import * as React from 'react';
import { NumericInput, INumericInputProps } from '@blueprintjs/core';
import { ReactElement } from 'lib/common/interfaces';

export default ({ onChange, ...props }): ReactElement => (
  <NumericInput onValueChange={onChange} {...props as INumericInputProps} />
);
