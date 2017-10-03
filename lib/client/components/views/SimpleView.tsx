declare const React;
import { Flex } from 'grid-styled';

interface IViewProps {
  primary: string | number | Date;
  secondary: string | number | Date;
}

export const SimpleView: React.SFC<IViewProps> = ({ primary, secondary, ...props }) => (
  <Flex align="center" justify="space-between" {...props}>
    <span>{primary}</span>
    <span>{secondary}</span>
  </Flex>
);
