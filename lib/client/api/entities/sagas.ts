import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, success, fail } from 'lib/client/services/utils';
import { IEntity, EntityEventType } from 'lib/common/interfaces';
import { updateLibrary } from '../user/actions';
import { IEntityAction } from './actions';

export function* createEntity({ payload }) {
  try {
    const { data: entity } = yield call(() => axios.post('/api/entities', payload));

    yield put(action(success(EntityEventType.Created), { entity }));
  } catch (error) {
    yield put(action(fail(EntityEventType.Created), { error }));
  }
}

export function* getEntities() {
  try {
    const { data: entities } = yield call(() => axios.get('/api/entities'));

    yield put(action(success(EntityEventType.Requested), { entities }));
  } catch (error) {
    yield put(action(fail(EntityEventType.Requested), { error }));
  }
}

export default function* entitiesSaga() {
  yield [
    // @ts-ignore
    takeLatest(EntityEventType.Created, createEntity),
    takeLatest(EntityEventType.Requested, getEntities)
  ];
}
