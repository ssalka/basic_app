import axios from 'axios';
import * as _ from 'lodash';
import { success, fail } from 'lib/client/services/utils';
import {
  Action,
  IEntity,
  IErrorPayload,
  Reducer,
  EntityDocument,
  EntityEventType,
  RequestStatus
} from 'lib/common/interfaces';

interface IEntityState {
  entities: EntityDocument[];
  error?: {
    status: number;
    message: string;
  };
}

type AddEntityReducer = Reducer<
  IEntityState,
  {
    entity?: EntityDocument;
    entities?: EntityDocument[];
  }
>;

const addEntity: AddEntityReducer = (state, { entity, entities }) => ({
  ...state,
  entities: state.entities.concat(entities || (entity as EntityDocument))
});

type UpdateEntityReducer = Reducer<IEntityState, { entity: EntityDocument }>;

const updateEntity: UpdateEntityReducer = (state, { entity }) => {
  const entityIndex = _.findIndex(state.entities, _.pick(entity, '_id'));
  const entities = _.cloneDeep(state.entities);
  entities[entityIndex] = entity;

  return {
    ...state,
    entities
  };
};

export default function entityReducer(
  state: IEntityState = { entities: [] },
  { type, error, ...action }: Action<IErrorPayload | any> // TODO: interfaces for success/fail action payloads
): IEntityState {
  switch (type) {
    case success(EntityEventType.Requested):
      return addEntity(state, action);

    case success(EntityEventType.Created):
      return addEntity(state, action);

    case success(EntityEventType.Updated):
      return updateEntity(state, action);

    default:
      return type.includes(RequestStatus.Fail) ? { ...state, error } : state;
  }
}
