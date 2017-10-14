import { Action, ActionCreator } from 'redux';
import { IUser } from 'lib/common/interfaces';
import { IState as ILoginState } from 'src/client/login';

export interface IUserAction extends Action {
  error?: {
    status: number;
    message: string;
  };
  loginArgs?: ['/login' | '/register', ILoginState['formData']];
  userId?: string;
  user?: IUser;
}

export const enum UserAction {
  FetchRequested = 'USER_FETCH_REQUESTED',
  FetchSucceeded = 'USER_FETCH_SUCCEEDED',
  FetchFailed = 'USER_FETCH_FAILED',
  LoginRequested = 'USER_LOGIN_REQUESTED',
  LoginSucceeded = 'USER_LOGIN_SUCCEEDED',
  LoginFailed = 'USER_LOGIN_FAILED',
  LogoutRequested = 'USER_LOGOUT_REQUESTED',
  LogoutSucceeded = 'USER_LOGOUT_SUCCEEDED',
  LogoutFailed = 'USER_LOGOUT_FAILED'
}

export const fetchUser: ActionCreator<IUserAction> = (userId?: string) => ({
  type: UserAction.FetchRequested,
  userId
});

export const userLogin: ActionCreator<IUserAction> = (path, loginInfo) => ({
  type: UserAction.LoginRequested,
  loginArgs: [path, loginInfo]
});

export const userLogout: ActionCreator<IUserAction> = () => ({
  type: UserAction.LogoutRequested
});

export default {
  fetchUser,
  userLogin,
  userLogout
};
