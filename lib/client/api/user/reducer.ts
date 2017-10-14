import axios from 'axios';
import * as _ from 'lodash';
import { IUser } from 'lib/common/interfaces';
import { IUserAction, UserAction } from './actions';

interface IUserState {
  error?: {
    status: number;
    message: string;
  };
  user?: IUser;
}

export default function userReducer(
  state: IUserState = {},
  { type, ...payload }: IUserAction
): IUserState {
  switch (type) {
    case UserAction.FetchSucceeded:
    case UserAction.LoginSucceeded:
      return { ...state, user: payload.user };
    case UserAction.LogoutSucceeded:
      return _.omit(state, 'user');
    case UserAction.FetchFailed:
    case UserAction.LogoutFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
