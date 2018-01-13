import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import { action, saga, success, fail } from 'lib/client/services/utils';
import { IEntity, EntityDocument } from 'lib/common/interfaces/entity';
import { CommandType, IEvent2 } from 'lib/common/interfaces/events';
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

    yield saga.success(CommandType.CreateEntity, { entity: createdEntity });
  } catch (error) {
    yield saga.fail(CommandType.CreateEntity, { error });
  }
}

export function* getEntities() {
  try {
    const entities: EntityDocument[] = yield saga.get('entities');

    yield saga.success<{ entities: EntityDocument[] }>(CommandType.GetEntities, {
      entities
    });
  } catch (error) {
    yield saga.fail(CommandType.GetEntities, { error });
  }
}

export function* renameEntity({ entity, newName }: Action<IRenameEntityPayload>) {
  try {
    const event: IEvent2 & Recorded<IRenameEntityPayload> = yield saga.post<
      Partial<Recorded<IRenameEntityPayload>>
    >(`entities/${entity._id}`, {
      newName,
      timestamp: new Date(),
      version: entity.version + 1
    });

    yield saga.success(CommandType.RenameEntity, { event });
  } catch (error) {
    yield saga.fail(CommandType.RenameEntity, { error });
  }
}

export default function* entitiesSaga() {
  yield [
    takeLatest(CommandType.CreateEntity, createEntity),
    takeLatest(CommandType.GetEntities, getEntities), // TODO: refactor to FetchEntitiesByUser
    takeLatest(CommandType.RenameEntity, renameEntity)
  ];
}
