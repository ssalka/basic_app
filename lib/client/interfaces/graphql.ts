export interface IMutationSettings {
  variables: {};
  getVariables(...args: any[]): {
    [key: string]: any
  };
}

export interface IGraphQLDocument {
  __typename: string;
}
