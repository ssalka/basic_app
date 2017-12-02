import axios from 'axios';
import * as _ from 'lodash';
import { IValue, ValueDocument, ValueEventType } from 'lib/common/interfaces';
import { IValueAction } from './actions';

interface IValueState {
  values: Record<string, ValueDocument>;
  error?: {
    status: number;
    message: string;
  };
}

function addValueToStore(state, value: ValueDocument) {
  return _.set({ ...state }, `values['${value._id}']`, value);
}

export default function valueReducer(
  state: IValueState = { values: {} },
  { type, ...payload }: IValueAction
): IValueState {
  switch (type) {
    case ValueEventType.CreateSucceeded:
      return addValueToStore(state, payload.value as ValueDocument);
    case ValueEventType.CreateFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
