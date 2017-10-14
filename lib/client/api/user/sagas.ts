import axios from 'axios';
import { call, put, takeLatest as _takeLatest } from 'redux-saga/effects';
import { IUserAction, UserAction } from './actions';

// BUG: TS definitions for takeLatest are overloaded - won't accept string as 1st arg
const takeLatest: any = _takeLatest;

export function* userLogin({ loginArgs: [path, payload] }: IUserAction) {
  try {
    const { data } = yield call(() => axios.post(path, payload));

    localStorage.token = data.token;

    yield put({
      type: UserAction.LoginSucceeded,
      user: data.user
    });
  } catch (error) {
    yield put({
      type: UserAction.LoginFailed,
      payload: { error }
    });
  }
}

export function* fetchUser({ userId }: IUserAction) {
  try {
    // TODO: call other user route if .userId is provided
    const { data } = yield call(() => axios.get('/api/me'));

    yield put({
      type: UserAction.FetchSucceeded,
      payload: data
    });
  } catch (error) {
    if (error.status === 403 && location.pathname !== '/login') {
      console.log('redirect to login');
    }

    yield put({
      type: UserAction.FetchFailed,
      payload: { error }
    });
  }
}

export function* userLogout() {
  try {
    const { token } = localStorage;

    if (token) {
      yield call(() => axios.post('/logout', { token }));
    }

    yield put({
      type: UserAction.LogoutSucceeded
    });
  } catch (error) {
    if (error.status === 403 && location.pathname !== '/login') {
      console.log('redirect to login');
    }

    yield put({
      type: UserAction.LogoutFailed,
      payload: { error }
    });
  }
}

export default function* userSaga() {
  yield [
    takeLatest(UserAction.LoginRequested, userLogin),
    takeLatest(UserAction.FetchRequested, fetchUser),
    takeLatest(UserAction.LogoutRequested, userLogout)
  ];
}
