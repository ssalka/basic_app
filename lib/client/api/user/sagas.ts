import axios from 'axios';
import { call, put, takeLatest as _takeLatest } from 'redux-saga/effects';
import { UserAction } from './actions';

// BUG: TS definitions for takeLatest are overloaded - won't accept string as 1st arg
const takeLatest: any = _takeLatest;

export function* fetchUser(action: UserAction) {
  try {
    // TODO: call other user route if action.userId is provided
    const user = yield call(() =>
      axios.get('/api/me').then(({ data }) => data.user)
    );

    yield put({
      type: UserAction.FetchSucceeded,
      payload: { user }
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

export default function* userSaga() {
  yield takeLatest(UserAction.FetchRequested, fetchUser);
}
