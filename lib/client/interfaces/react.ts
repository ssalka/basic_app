declare const React;

export type ReactElement = React.ReactElement<any>;

export interface RouteProps {
  history: {
    go: () => void;
    goBack: () => void;
    goForward: () => void;
    push: (any) => void;
    pushState: () => void;
    replace: () => void;
    replaceState: () => void;
    transitionTo: () => void;
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
  component: (props) => void
};

export interface QueryProps {
  error?: any;
  loadNextPage?: Function;
  loading: boolean;
  networkStatus: number;
  refetch: Function;
  startPolling: Function;
  stopPolling: Function;
  variables: any;
}
