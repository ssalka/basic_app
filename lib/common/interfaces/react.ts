import * as React from 'react';

export type ReactElement = React.ReactElement<any>;

export type SFC = React.SFC<any> | ((...args: any[]) => ReactElement);

export type EventHandler = React.EventHandler<any>;

export type ReactProps = React.Props<any> & React.HTMLAttributes<any>;

export interface IComponentModule {
  [key: string]: SFC;
}

export interface IFunctionModule {
  [handler: string]: (...args: any[]) => any;
}

export interface ILink {
  name: string;
  path: string;
  icon: string;
}

export interface ICSSProps {
  p?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  px?: string | number;
  py?: string | number;
  m?: string | number;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  mx?: string | number;
  my?: string | number;
  width?: string | number;
}
