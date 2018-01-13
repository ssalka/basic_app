import axios from 'axios';
import * as _ from 'lodash';
import { success, fail } from 'lib/client/services/utils';
import {
  Action,
  IEntity,
  IErrorPayload,
  Reducer,
  EntityDocument,
  CommandType,
  RequestStatus,
  Recorded,
  IEvent2
} from 'lib/common/interfaces';
import { IRenameEntityPayload } from './actions';

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

type RenameEntityReducer = Reducer<
  IEntityState,
  { event: IEvent2 & Recorded<IRenameEntityPayload> }
>;

const renameEntity: RenameEntityReducer = (state, { event }) => {
  const entityIndex = _.findIndex(state.entities, { _id: event.entity });
  const entities = _.cloneDeep(state.entities);
  entities[entityIndex].name = event.newName;
  entities[entityIndex].version = event.version;

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
    case success(CommandType.GetEntities):
      return addEntity(state, action);

    case success(CommandType.CreateEntity):
      return addEntity(state, action);

    case success(CommandType.RenameEntity):
      return renameEntity(state, action);

    default:
      return type.includes(RequestStatus.Fail) ? { ...state, error } : state;
  }
}
