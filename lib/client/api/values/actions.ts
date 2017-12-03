import { Action, ActionCreator } from 'redux';
import {
  CreateValueEvent,
  IValue,
  ValueDocument,
  ValueEvent,
  ValueEventType
} from 'lib/common/interfaces';

export interface IValueAction extends Action {
  value?: IValue | ValueDocument;
  values?: ValueDocument[];
  error?: {
    status: number;
    message: string;
  };
}

export const createValue: ActionCreator<CreateValueEvent> = (value: IValue) => ({
  type: ValueEventType.CreateRequested,
  payload: { value }
});

export const getValues: ActionCreator<any> = () => ({
  type: ValueEventType.BatchFetchRequested
});

export default {
  createValue,
  getValues
};
