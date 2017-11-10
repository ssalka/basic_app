import axios from 'axios';
import * as _ from 'lodash';
import { Value } from 'lib/common/interfaces';
import { IValueAction, ValueAction } from './actions';

interface IValueState {
  values: Record<string, Value>;
  error?: {
    status: number;
    message: string;
  };
}

function addValueToStore(state, value: Value) {
  return _.set({ ...state }, `values['${value._id}']`, value);
}

export default function valueReducer(
  state: IValueState = { values: {} },
  { type, ...payload }: IValueAction
): IValueState {
  switch (type) {
    case ValueAction.CreateSucceeded:
      return addValueToStore(state, payload.value);
    case ValueAction.CreateFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
