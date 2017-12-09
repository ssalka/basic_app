import { Action as ReduxAction, ActionCreatorsMapObject } from 'redux';

export interface IReduxProps {
  actions: ActionCreatorsMapObject;
  store: Record<string, any>; // TODO: IReduxState
}

export type Action<P extends {}> = ReduxAction & {
  payload: P;
};

export type Reducer<S = {}, A = ReduxAction> = (state: S, action: A) => S;
