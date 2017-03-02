import { NumericInput } from '@blueprintjs/core';

module.exports = ({ onChange, ...props }) => (
  <NumericInput onValueChange={onChange} {...props} />
)
