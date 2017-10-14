import axios from 'axios';
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
  { type, payload = {} }: IUserAction
): IUserState {
  switch (type) {
    case UserAction.FetchSucceeded:
      return { ...state, user: payload.user };
    case UserAction.FetchFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
