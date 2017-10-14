import { fork } from 'redux-saga/effects';
import userSaga from './userSagas';

export default function* rootSaga() {
  yield fork(userSaga);
}
