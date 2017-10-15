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
  Added = 'DOCUMENT_ADDED_TO_STORE',
  AddedMany = 'MANY_DOCUMENTS_ADDED_TO_STORE',
  UpsertRequested = 'DOCUMENT_UPSERT_REQUESTED',
  UpsertSucceeded = 'DOCUMENT_UPSERT_SUCCEEDED',
  UpsertFailed = 'DOCUMENT_UPSERT_FAILED'
}

export const addDocument: ActionCreator<IDocumentAction> = (
  collectionId: string,
  document: IDocument
) =>
  action(DocumentAction.Added, {
    collectionId,
    document
  });

export const addDocuments: ActionCreator<IDocumentAction> = (
  collectionId: string,
  documents: IDocument[]
) =>
  action(DocumentAction.AddedMany, {
    collectionId,
    documents
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
  addDocument,
  addDocuments,
  upsertDocument,
  upsertSucceeded,
  upsertFailed
};
