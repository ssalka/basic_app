import axios from 'axios';
import { IUser } from 'lib/common/interfaces';
import { IUserAction, UserAction } from '../actions';

interface IUserState {
  user?: IUser;
}

export default function userReducer(
  state: IUserState = {},
  { type, payload = {} }: IUserAction
): IUserState {
  switch (type) {
    case UserAction.FetchSucceeded:
      return { ...state, user: payload.user };
    default:
      return state;
  }
}
