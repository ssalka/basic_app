import * as React from 'react';
import { Flex } from 'grid-styled';
import { ICSSProps } from 'lib/common/interfaces';

export interface ISimpleViewProps extends React.HTMLAttributes<any>, ICSSProps {
  primary: string | number | Date;
  secondary?: string | number | Date;
}

export const SimpleView: React.SFC<ISimpleViewProps> = ({
  primary,
  secondary,
  ...props
}) =>
  secondary ? (
    <span {...props}>{primary}</span>
  ) : (
    <Flex align="center" justify="space-between" {...props}>
      <span>{primary}</span>
      {secondary && <span>{secondary}</span>}
    </Flex>
  );
