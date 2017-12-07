import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, success, fail } from 'lib/client/services/utils';
import { IValue, ValueEventType } from 'lib/common/interfaces';
import { updateLibrary } from '../user/actions';
import { IValueAction } from './actions';

export function* createValue({ payload }) {
  try {
    const { data: value } = yield call(() => axios.post('/api/values', payload));

    yield put(action(success(ValueEventType.Created), { value }));
  } catch (error) {
    yield put(action(fail(ValueEventType.Created), { error }));
  }
}

export function* getValues() {
  try {
    const { data: values } = yield call(() => axios.get('/api/values'));

    yield put(action(success(ValueEventType.Requested), { values }));
  } catch (error) {
    yield put(action(fail(ValueEventType.Requested), { error }));
  }
}

export default function* valuesSaga() {
  yield [
    // @ts-ignore
    takeLatest(ValueEventType.Created, createValue),
    takeLatest(ValueEventType.Requested, getValues)
  ];
}
