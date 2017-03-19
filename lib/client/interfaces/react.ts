declare const React;

export type ReactElement = React.ReactElement<any>;

export type SFC = React.SFC<any>;

export type EventHandler = React.EventHandler<any>;

export type ReactProps = React.Props<any>;

export interface IRouteProps extends ReactProps {
  history: {
    go(): void;
    goBack(): void;
    goForward(): void;
    push(path: string | object): void;
    pushState(): void;
    replace(): void;
    replaceState(): void;
    transitionTo(): void;
  };
  location: {
    pathname: string;
    state: any;
  };
  route: Route;
  routes: Route[];
}

type Route = {
  childRoutes: Route[],
  component(props): void
};

export interface IQueryProps extends ReactProps {
  error?: any;
  loadNextPage?: Function;
  loading: boolean;
  networkStatus: number;
  refetch: Function;
  startPolling: Function;
  stopPolling: Function;
  variables: any;
}

export interface IComponentModule {
  [key: string]: SFC;
}

export interface ILink {
  name: string;
  path: string;
  icon: string;
}
