import { IEntity, IPopulatedEntity } from './entity';
import { IUser } from './user';

export interface IEvent<P extends {} = {}> {
  type: string;
  payload?: P;
}

export interface IEvent2 {
  entity: string | IEntity | IPopulatedEntity;
  type: string;
  timestamp: Date;
  version: number;
  user?: string | IUser;
}
