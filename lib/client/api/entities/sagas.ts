import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, saga, success, fail } from 'lib/client/services/utils';
import { IEntity, EntityDocument, EntityEventType } from 'lib/common/interfaces/entity';
import { Action } from 'lib/common/interfaces/redux';
import { updateLibrary } from '../user/actions';
import { ICreateEntityPayload, IUpdateEntityPayload } from './actions';

export function* createEntity({ entity }: Action<ICreateEntityPayload>) {
  try {
    const createdEntity: EntityDocument = yield saga.post<ICreateEntityPayload['entity']>(
      'entities',
      entity
    );

    yield saga.success(EntityEventType.Created, { entity: createdEntity });
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

export function* updateEntity({ entityId, updates }: Action<IUpdateEntityPayload>) {
  try {
    const entity: EntityDocument = yield saga.post<IUpdateEntityPayload['updates']>(
      `entities/${entityId}`,
      updates
    );

    yield saga.success(EntityEventType.Updated, { entity });
  } catch (error) {
    yield saga.fail(EntityEventType.Updated, { error });
  }
}

export default function* entitiesSaga() {
  yield [
    takeLatest(EntityEventType.Created, createEntity),
    takeLatest(EntityEventType.Requested, getEntities),
    takeLatest(EntityEventType.Updated, updateEntity)
  ];
}