import { ActionCreator } from 'redux';
import { IAction, IUser } from 'lib/common/interfaces';

export interface IUserActionPayload {
  error?: {
    status: number;
    message: string;
  };
  userId?: string;
  user?: IUser;
}

export type IUserAction = IAction<IUserActionPayload>;

export const enum UserAction {
  FetchRequested = 'USER_FETCH_REQUESTED',
  FetchSucceeded = 'USER_FETCH_SUCCEEDED',
  FetchFailed = 'USER_FETCH_FAILED'
}

export const fetchUser: ActionCreator<IUserAction> = (userId?: string) => ({
  type: UserAction.FetchRequested,
  payload: { userId }
});

export default {
  fetchUser
};
