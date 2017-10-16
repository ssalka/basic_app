import axios from 'axios';
import * as _ from 'lodash';
import { Collection } from 'lib/common/interfaces';
import { ICollectionAction, CollectionAction } from './actions';

interface ICollectionState {
  collections: Record<string, Collection>;
  error?: {
    status: number;
    message: string;
  };
}

function updateCollections(state, addedCollections: Collection[]) {
  const collections = addedCollections.reduce(
    (newCollections, collection) => ({
      ...newCollections,
      [collection._id]: collection
    }),
    {
      ...state.collections
    }
  );

  return {
    ...state,
    collections
  };
}

function upsertCollection(state, collection: Collection) {
  return _.set({ ...state }, `collections['${collection._id}']`, collection);
}

export default function collectionReducer(
  state: ICollectionState = { collections: {} },
  { type, ...payload }: ICollectionAction
): ICollectionState {
  switch (type) {
    case CollectionAction.AddedMany:
      return updateCollections(state, payload.collections);
    case CollectionAction.Added:
    case CollectionAction.UpsertSucceeded:
      return upsertCollection(state, payload.collection);
    case CollectionAction.UpsertFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
