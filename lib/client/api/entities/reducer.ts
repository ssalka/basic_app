import * as _ from 'lodash';
import produce from 'immer';
import { success } from 'lib/client/services/utils';
import {
  Action,
  IErrorPayload,
  Reducer,
  EntityDocument,
  CommandType,
  QueryType,
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

const renameEntity: RenameEntityReducer = (state, { event }) =>
  produce(state, ({ entities }) => {
    const entityIndex = _.findIndex(entities, { _id: event.entity });

    _.assign(entities[entityIndex], {
      name: event.newName,
      version: event.version
    });
  });

export default function entityReducer(
  state: IEntityState = { entities: [] },
  { type, error, ...action }: Action<IErrorPayload | any> // TODO: interfaces for success/fail action payloads
): IEntityState {
  switch (type) {
    case success(QueryType.FetchEntitiesByUser):
      return addEntity(state, action);

    case success(CommandType.CreateEntity):
      return addEntity(state, action);

    case success(CommandType.RenameEntity):
      return renameEntity(state, action);

    default:
      return type.includes(RequestStatus.Fail) ? { ...state, error } : state;
  }
}
