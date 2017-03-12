export interface IMutationSettings {
  variables: {};
  getVariables(...args: any[]): {
    [key: string]: any
  };
}
