import { Action, ActionCreatorsMapObject } from 'redux';

export interface IReduxProps {
  actions: ActionCreatorsMapObject;
  store: Record<string, any>; // TODO: IReduxState
}

export type Reducer<S = {}, A = Action> = (state: S, action: A) => S;
