import axios from 'axios';
import * as _ from 'lodash';
import { success, fail } from 'lib/client/services/utils';
import { IEntity, Reducer, EntityDocument, EntityEventType } from 'lib/common/interfaces';
import { IEntityAction } from './actions';

interface IEntityState {
  entities: EntityDocument[];
  error?: {
    status: number;
    message: string;
  };
}

const addEntity: Reducer<IEntityState, EntityDocument | EntityDocument[]> = (
  state,
  entity
) => ({
  ...state,
  entities: state.entities.concat(entity)
});

export default function entityReducer(
  state: IEntityState = { entities: [] },
  { type, entity, entities, error }: IEntityAction
): IEntityState {
  switch (type) {
    case success(EntityEventType.Requested):
      return addEntity(state, entities);

    case success(EntityEventType.Created):
      return addEntity(state, entity as EntityDocument);
    case fail(EntityEventType.Created):
      return { ...state, error };

    default:
      return state;
  }
}
