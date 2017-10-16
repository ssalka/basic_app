import { Action, ActionCreator } from 'redux';
import { action } from 'lib/client/services/utils';
import { IDocument } from 'lib/common/interfaces';

export interface IDocumentAction extends Action {
  collectionId?: string;
  document?: IDocument;
  documents?: IDocument[];
  error?: {
    status: number;
    message: string;
  };
}

export const enum DocumentAction {
  BatchFetchRequested = 'DOCUMENT_BATCH_FETCH_REQUESTED',
  BatchFetchSucceeded = 'DOCUMENT_BATCH_FETCH_SUCCEEDED',
  BatchFetchFailed = 'DOCUMENT_BATCH_FETCH_FAILED',
  Added = 'DOCUMENT_ADDED_TO_STORE',
  UpsertRequested = 'DOCUMENT_UPSERT_REQUESTED',
  UpsertSucceeded = 'DOCUMENT_UPSERT_SUCCEEDED',
  UpsertFailed = 'DOCUMENT_UPSERT_FAILED'
}

export const loadDocumentsInCollection: ActionCreator<IDocumentAction> = (
  collectionId: string
) =>
  action(DocumentAction.BatchFetchRequested, {
    collectionId
  });

export const batchFetchSucceeded: ActionCreator<IDocumentAction> = (
  collectionId: string,
  documents: IDocument[]
) =>
  action(DocumentAction.BatchFetchSucceeded, {
    collectionId,
    documents
  });

export const batchFetchFailed: ActionCreator<IDocumentAction> = (
  error: IDocumentAction['error']
) =>
  action(DocumentAction.UpsertSucceeded, {
    error
  });

export const addDocument: ActionCreator<IDocumentAction> = (
  collectionId: string,
  document: IDocument
) =>
  action(DocumentAction.Added, {
    collectionId,
    document
  });

export const upsertDocument: ActionCreator<IDocumentAction> = (
  collectionId: string,
  document: IDocument
) =>
  action(DocumentAction.UpsertRequested, {
    collectionId,
    document
  });

export const upsertSucceeded: ActionCreator<IDocumentAction> = (
  collectionId: string,
  document: IDocument
) =>
  action(DocumentAction.UpsertSucceeded, {
    collectionId,
    document
  });

export const upsertFailed: ActionCreator<IDocumentAction> = (
  error: IDocumentAction['error']
) =>
  action(DocumentAction.UpsertSucceeded, {
    error
  });

export default {
  loadDocumentsInCollection,
  addDocument,
  upsertDocument,
  upsertSucceeded,
  upsertFailed
};
