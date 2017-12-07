import axios from 'axios';
import * as _ from 'lodash';
import { success, fail } from 'lib/client/services/utils';
import { IValue, Reducer, ValueDocument, ValueEventType } from 'lib/common/interfaces';
import { IValueAction } from './actions';

interface IValueState {
  values: ValueDocument[];
  error?: {
    status: number;
    message: string;
  };
}

const addValue: Reducer<IValueState, ValueDocument | ValueDocument[]> = (
  state,
  value
) => ({
  ...state,
  values: state.values.concat(value)
});

export default function valueReducer(
  state: IValueState = { values: [] },
  { type, value, values, error }: IValueAction
): IValueState {
  switch (type) {
    case ValueEventType.Requested:
      return addValue(state, values);
    case success(ValueEventType.Created):
      return addValue(state, value as ValueDocument);
    case fail(ValueEventType.Created):
      return { ...state, error };
    default:
      return state;
  }
}
