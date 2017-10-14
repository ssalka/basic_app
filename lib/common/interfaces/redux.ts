import { Action, ActionCreatorsMapObject } from 'redux';

export interface IAction<P = {}> extends Action {
  payload: Partial<P>;
}

export interface IReduxProps {
  actions: ActionCreatorsMapObject;
  store: Record<string, any>; // TODO: IReduxState
}
