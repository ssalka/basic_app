import * as _ from 'lodash';
import * as React from 'react';

interface IProps extends React.Props<any>, React.HTMLAttributes<any> {
  className?: string;
  classNames?: string[];
  style?: {};
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: boolean;
}

export default function getFlexComponent(type: 'row' | 'column') {
  return ({
    className = '',
    classNames = [],
    style = {},
    justifyContent = 'space-between',
    alignItems = 'stretch',
    flexWrap = false,
    ...props
  }: IProps) => {
    const flexProps: Partial<IProps> = _.assign({
      className: classNames.concat(className, `flex-${type}`).join(' '),
      style: _.assign(style, {
        justifyContent,
        alignItems,
        flexWrap: flexWrap ? 'wrap' : 'nowrap'
      }),
      ...props
    });

    return <div {...flexProps as React.Props<HTMLDivElement>} />;
  };
}
