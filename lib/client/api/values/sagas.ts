import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'lib/client/services/utils';
import { updateLibrary } from '../user/actions';
import { IValueAction, ValueAction } from './actions';

export function* createValue({ value }: IValueAction) {
  try {
    const { data: createdValue } = yield call(() => axios.post('/api/values', { value }));

    yield put(action(ValueAction.CreateSucceeded, { value: createdValue }));
  } catch (error) {
    yield put(action(ValueAction.CreateFailed, { error }));
  }
}

export default function* valuesSaga() {
  yield takeLatest(ValueAction.CreateRequested, createValue);
}
