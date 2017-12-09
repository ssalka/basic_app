import { fork } from 'redux-saga/effects';
import { collectionsSaga } from './collections';
import { documentsSaga } from './documents';
import { entitiesSaga } from './entities';
import { userSaga } from './user';

export default function* rootSaga() {
  yield [fork(userSaga), fork(collectionsSaga), fork(documentsSaga), fork(entitiesSaga)];
}
