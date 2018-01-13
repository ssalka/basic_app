import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, saga, success, fail } from 'lib/client/services/utils';
import { IEntity, EntityDocument, EventType } from 'lib/common/interfaces/entity';
import { Recorded } from 'lib/common/interfaces/mongo';
import { Action } from 'lib/common/interfaces/redux';
import { updateLibrary } from '../user/actions';
import { ICreateEntityPayload, IRenameEntityPayload } from './actions';

export function* createEntity({ type, ...payload }: Action<ICreateEntityPayload>) {
  try {
    const createdEntity: EntityDocument = yield saga.post<ICreateEntityPayload>(
      'entities',
      payload
    );

    yield saga.success(EventType.EntityCreated, { entity: createdEntity });
  } catch (error) {
    yield saga.fail(EventType.EntityCreated, { error });
  }
}

export function* getEntities() {
  try {
    const entities: EntityDocument[] = yield saga.get('entities');

    yield saga.success<{ entities: EntityDocument[] }>(EventType.EntitiesRequested, {
      entities
    });
  } catch (error) {
    yield saga.fail(EventType.EntitiesRequested, { error });
  }
}

export function* renameEntity({ entity, newName }: Action<IRenameEntityPayload>) {
  try {
    const renamedEntity: EntityDocument = yield saga.post<
      Partial<Recorded<IRenameEntityPayload>>
    >(`entities/${entity._id}`, {
      newName,
      timestamp: new Date(),
      version: entity.version + 1
    });

    yield saga.success(EventType.EntityRenamed, { entity: renamedEntity });
  } catch (error) {
    yield saga.fail(EventType.EntityRenamed, { error });
  }
}

export default function* entitiesSaga() {
  yield [
    takeLatest(EventType.EntityCreated, createEntity),
    takeLatest(EventType.EntitiesRequested, getEntities),
    takeLatest(EventType.EntityRenamed, renameEntity)
  ];
}
