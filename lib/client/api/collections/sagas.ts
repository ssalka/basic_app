import axios from 'axios';
import { push } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'lib/client/services/utils';
import { updateLibrary } from '../user/actions';
import { ICollectionAction, CollectionAction } from './actions';

export function* upsertCollection({ collection }: ICollectionAction) {
  try {
    const { data: coll } = yield call(() =>
      axios.post(`/api/collections/${collection._id}`, collection)
    );

    yield put(updateLibrary(coll));

    yield [put(push(coll.path)), put(action(CollectionAction.UpsertSucceeded))];
  } catch (error) {
    yield put(action(CollectionAction.UpsertFailed, { error }));
  }
}

export default function* collectionsSaga() {
  yield takeLatest(CollectionAction.UpsertRequested, upsertCollection);
}
