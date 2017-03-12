export interface IMutationSettings {
  getVariables: (...args: any[]) => {
    [key: string]: any
  };
  variables: {};
}
