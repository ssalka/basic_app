import { ActionCreatorsMapObject } from 'redux';

export interface IReduxProps {
  actions: ActionCreatorsMapObject;
  store: Record<string, any>; // TODO: IReduxState
}
