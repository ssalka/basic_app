import axios from 'axios';
import { Action, ActionCreator } from 'redux';
import { IUser } from 'lib/common/interfaces';
import { UserAction } from '../actions';

interface IUserState {
  user?: IUser;
}

export default function userReducer(
  state: IUserState = {},
  action: Action
): IUserState {
  switch (action.type) {
    default:
      return state;
  }
}
