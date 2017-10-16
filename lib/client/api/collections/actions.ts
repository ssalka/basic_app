import { Action, ActionCreator } from 'redux';
import { Collection } from 'lib/common/interfaces';

export interface ICollectionAction extends Action {
  collection?: Collection;
  collections?: Collection[];
  error?: {
    status: number;
    message: string;
  };
}

export const enum CollectionAction {
  Added = 'COLLECTION_ADDED_TO_STORE',
  AddedMany = 'MULTIPLE_COLLECTION_ADDED_TO_STORE',
  UpsertRequested = 'COLLETION_UPSERT_REQUESTED',
  UpsertSucceeded = 'COLLETION_UPSERT_SUCCEEDED',
  UpsertFailed = 'COLLETION_UPSERT_FAILED'
}

export const addCollection: ActionCreator<ICollectionAction> = (
  collection: Collection
) => ({
  type: CollectionAction.Added,
  collection
});

export const addCollections: ActionCreator<ICollectionAction> = (
  collections: Collection[]
) => ({
  type: CollectionAction.AddedMany,
  collections
});

export const upsertCollection: ActionCreator<ICollectionAction> = (
  collection: Collection
) => ({
  type: CollectionAction.UpsertRequested,
  collection
});

export default {
  addCollection,
  addCollections,
  upsertCollection
};
