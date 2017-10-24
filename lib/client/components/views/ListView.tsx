import * as _ from 'lodash';
import * as React from 'react';
import Link from 'react-router-redux-dom-link';
import { Flex } from 'grid-styled';
import { SimpleView, ISimpleViewProps } from './SimpleView';

interface IListItem {
  labelKey: string;
  sublabelKey?: string;
  link?: string;
}

interface IListViewProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Record<string, any>[];
  keys: {
    primary: string;
    secondary?: string;
    link?: string;
  };
  itemStyle?: React.CSSProperties;
}

export const ListView: React.SFC<IListViewProps> = ({
  items,
  keys,
  itemStyle,
  ...props
}) => (
  <Flex column={true} align="stretch" justify="flex-start" {...props}>
    {items
      .map((item: IListItem): ISimpleViewProps => _.mapValues(keys, key => item[key]))
      .map(
        ({ link, ...listViewProps }: IListViewProps['keys'], i: number): JSX.Element =>
          link ? (
            <Link to={link} style={{ ...itemStyle, margin: 5 }}>
              <SimpleView key={i} {...listViewProps} />
            </Link>
          ) : (
            <SimpleView key={i} p={5} style={itemStyle} {...listViewProps} />
          )
      )}
  </Flex>
);
