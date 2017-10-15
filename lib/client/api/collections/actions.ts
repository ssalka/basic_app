import { Action, ActionCreator } from 'redux';
import { Collection } from 'lib/common/interfaces';

export interface ICollectionAction extends Action {
  collection?: Collection;
  error?: {
    status: number;
    message: string;
  };
}

export const enum CollectionAction {
  UpsertRequested = 'COLLETION_UPSERT_REQUESTED',
  UpsertSucceeded = 'COLLETION_UPSERT_SUCCEEDED',
  UpsertFailed = 'COLLETION_UPSERT_FAILED'
}

export const upsertCollection: ActionCreator<ICollectionAction> = (
  collection: Collection
) => ({
  type: CollectionAction.UpsertRequested,
  collection
});

export default {
  upsertCollection
};
