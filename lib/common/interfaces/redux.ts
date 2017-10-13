import { Action } from 'redux';

export interface IAction<P = {}> {
  type: string;
  payload: P;
}
