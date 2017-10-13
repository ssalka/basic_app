import { IAction } from 'lib/common/interfaces';

type IUserAction = IAction<{
  userId: string;
}>;

export const enum UserAction {
  FetchRequested = 'USER_FETCH_REQUESTED',
  FetchSucceeded = 'USER_FETCH_SUCCEEDED',
  FetchFailed = 'USER_FETCH_FAILED'
}

export const userActions = {
  loadUser(userId: string): IUserAction {
    return {
      type: UserAction.FetchRequested,
      payload: { userId }
    };
  }
};
