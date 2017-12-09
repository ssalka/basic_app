import { Action, ActionCreator } from 'redux';
import {
  CreateEntityEvent,
  IEntity,
  EntityDocument,
  EntityEvent,
  EntityEventType
} from 'lib/common/interfaces';

export interface IEntityAction extends Action {
  entity?: IEntity | EntityDocument;
  entities?: EntityDocument[];
  error?: {
    status: number;
    message: string;
  };
}

export const createEntity: ActionCreator<CreateEntityEvent> = (entity: IEntity) => ({
  type: EntityEventType.Created,
  payload: entity
});

export const getEntities: ActionCreator<any> = () => ({
  type: EntityEventType.Requested
});

export default {
  createEntity,
  getEntities
};
