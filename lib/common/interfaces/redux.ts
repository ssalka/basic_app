import { Action as ReduxAction, ActionCreatorsMapObject } from 'redux';

export interface IReduxProps {
  actions: ActionCreatorsMapObject;
  store: Record<string, any>; // TODO: IReduxState
}

export type Action<A extends {} = {}> = ReduxAction & A;

export type Reducer<S = {}, A = {}> = (state: S, action: ReduxAction & A) => S;

export interface IErrorPayload {
  error: string | Error;
}
