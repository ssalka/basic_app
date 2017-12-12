import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, saga, success, fail } from 'lib/client/services/utils';
import { IEntity, EntityDocument, EntityEventType } from 'lib/common/interfaces';
import { updateLibrary } from '../user/actions';
import { IEntityAction, UpdateEntityPayload } from './actions';

export function* createEntity({ payload }) {
  try {
    const entity: EntityDocument = yield saga.post<IEntity>('entities', payload);

    yield saga.success(EntityEventType.Created, { entity });
  } catch (error) {
    yield saga.fail(EntityEventType.Created, { error });
  }
}

export function* getEntities() {
  try {
    const entities: EntityDocument[] = yield saga.get('entities');

    yield saga.success<{ entities: EntityDocument[] }>(EntityEventType.Requested, {
      entities
    });
  } catch (error) {
    yield saga.fail(EntityEventType.Requested, { error });
  }
}

export function* updateEntity({ payload }) {
  try {
    const entity: EntityDocument = yield saga.post<UpdateEntityPayload>(
      'entities',
      payload
    );

    yield saga.success(EntityEventType.Updated, { entity });
  } catch (error) {
    yield saga.fail(EntityEventType.Updated, { error });
  }
}

export default function* entitiesSaga() {
  yield [
    // @ts-ignore
    takeLatest(EntityEventType.Created, createEntity),
    takeLatest(EntityEventType.Requested, getEntities),
    takeLatest(EntityEventType.Updated, updateEntity)
  ];
}
