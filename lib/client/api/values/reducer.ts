import axios from 'axios';
import * as _ from 'lodash';
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
    case ValueEventType.BatchFetchSucceeded:
      return addValue(state, values);
    case ValueEventType.CreateSucceeded:
      return addValue(state, value as ValueDocument);
    case ValueEventType.CreateFailed:
      return { ...state, error };
    default:
      return state;
  }
}
