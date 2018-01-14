import * as _ from 'lodash';
import { IDocument } from 'lib/common/interfaces';
import { IDocumentAction, DocumentAction } from './actions';

interface IDocumentState {
  byCollection: {
    [collectionId: string]: IDocument[];
  };
  error?: {
    status: number;
    message: string;
  };
}

function setDocuments(state, collectionId, documents) {
  return _.set({ ...state }, `byCollection['${collectionId}']`, documents);
}

function updateDocuments(
  state,
  collectionId: string,
  addedDocuments: IDocument[]
): IDocumentState {
  const documents: IDocument[] = _.unionWith(state.documents, addedDocuments, '_id');

  return setDocuments(state, collectionId, documents);
}

function upsertDocument(state, collectionId: string, doc: IDocument) {
  const documents: IDocument[] = state.byCollection[collectionId].slice();

  const indexToUpdate: number = _.findIndex(documents, { _id: doc._id });

  if (indexToUpdate >= 0) {
    documents.splice(indexToUpdate, 1, doc);
  } else {
    documents.push(doc);
  }

  return setDocuments(state, collectionId, documents);
}

export default function documentReducer(
  state: IDocumentState = { byCollection: {} },
  { type, ...payload }: IDocumentAction
): IDocumentState {
  switch (type) {
    case DocumentAction.BatchFetchSucceeded:
      return updateDocuments(state, payload.collectionId, payload.documents);
    case DocumentAction.Added:
    case DocumentAction.UpsertSucceeded:
      return upsertDocument(state, payload.collectionId, payload.document);
    case DocumentAction.BatchFetchFailed:
    case DocumentAction.UpsertFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
