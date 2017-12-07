export interface IEvent<P extends {} = {}> {
  type: string;
  payload?: P;
}
