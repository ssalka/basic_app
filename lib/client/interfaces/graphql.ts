export interface MutationSettings {
  getVariables: (...args: any[]) => {
    [key: string]: any
  };
  variables: {};
}
