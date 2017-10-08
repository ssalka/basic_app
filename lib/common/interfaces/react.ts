declare const React;

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
