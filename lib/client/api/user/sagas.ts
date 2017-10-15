import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IUserAction, UserAction } from './actions';

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
      error
    });
  }
}

export function* fetchUser({ userId }: IUserAction) {
  try {
    // TODO: call other user route if .userId is provided
    const { data } = yield call(() => axios.get('/api/me'));

    yield put({
      type: UserAction.FetchSucceeded,
      ...data
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

export function* userLogout({ token }: IUserAction) {
  try {
    yield call(() => axios.post('/logout', { token }));

    yield put({
      type: UserAction.LogoutSucceeded
    });

    delete localStorage.token;
  } catch (error) {
    yield put({
      type: UserAction.LogoutFailed,
      error
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
