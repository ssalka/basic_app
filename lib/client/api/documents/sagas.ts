import axios from 'axios';
import { goBack } from 'react-router-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'lib/client/services/utils';
import {
  IDocumentAction,
  DocumentAction,
  upsertSucceeded,
  upsertFailed
} from './actions';

export function* upsertDocument({
  collectionId,
  document: doc
}: IDocumentAction) {
  try {
    const { data: upsertedDoc } = yield call(() =>
      axios.post(`/api/collections/${collectionId}/documents/${doc._id}`, {
        document: doc
      })
    );

    yield [put(upsertSucceeded(upsertedDoc)), put(goBack())];
  } catch (error) {
    yield put(upsertFailed(error));
  }
}

export default function* documentsSaga() {
  yield takeLatest(DocumentAction.UpsertRequested, upsertDocument);
}
