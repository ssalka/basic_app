import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'lib/client/services/utils';
import { IUserAction, UserAction } from './actions';
import { addCollection, CollectionAction } from '../collections/actions';

export function* userLogin({ loginArgs: [path, payload] }: IUserAction) {
  try {
    const { data } = yield call(() => axios.post(path, payload));

    localStorage.token = data.token;

    yield put(
      action(UserAction.LoginSucceeded, {
        user: data.user
      })
    );

    yield put(push('/home'));

    yield put(
      action(CollectionAction.AddedMany, {
        collections: data.user.library.collections
      })
    );
  } catch (error) {
    yield put(
      action(UserAction.LoginFailed, {
        error
      })
    );
  }
}

export function* fetchUser({ userId }: IUserAction) {
  try {
    // TODO: call other user route if userId is provided
    const { data } = yield call(() => axios.get('/api/me'));

    yield put(
      action(UserAction.FetchSucceeded, {
        ...data
      })
    );

    yield put(
      action(CollectionAction.AddedMany, {
        collections: data.user.library.collections
      })
    );
  } catch (error) {
    if (error.status === 403 && location.pathname !== '/login') {
      console.log('redirect to login');
    }

    yield put(
      action(UserAction.FetchFailed, {
        error
      })
    );
  }
}

export function* userLogout({ token }: IUserAction) {
  try {
    yield call(() => axios.post('/logout', { token }));

    yield put(action(UserAction.LogoutSucceeded));

    delete localStorage.token;
  } catch (error) {
    yield put(
      action(UserAction.LogoutFailed, {
        error
      })
    );
  }
}

export default function* userSaga() {
  yield [
    takeLatest(UserAction.LoginRequested, userLogin),
    takeLatest(UserAction.FetchRequested, fetchUser),
    takeLatest(UserAction.LogoutRequested, userLogout)
  ];
}
