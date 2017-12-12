import { Action, ActionCreator } from 'redux';
import { IEntity, IEvent, EntityDocument, EntityEventType } from 'lib/common/interfaces';

export interface IEntityAction extends Action {
  entity?: IEntity | EntityDocument;
  entities?: EntityDocument[];
  updates?: Partial<IEntity>;
  error?: {
    status: number;
    message: string;
  };
}

type CreateEntityEvent = IEvent<IEntity>;

export const createEntity: ActionCreator<CreateEntityEvent> = (entity: IEntity) => ({
  type: EntityEventType.Created,
  payload: entity
});

export const getEntities: ActionCreator<IEvent> = () => ({
  type: EntityEventType.Requested
});

export type UpdateEntityPayload = Pick<IEntityAction, 'entity' | 'updates'>;

export const updateEntity: ActionCreator<IEvent<UpdateEntityPayload>> = (
  entity: EntityDocument,
  updates: Partial<IEntity>
) => ({
  type: EntityEventType.Updated,
  payload: {
    entity,
    updates
  }
});

export default {
  createEntity,
  getEntities,
  updateEntity
};
