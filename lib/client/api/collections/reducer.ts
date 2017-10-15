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

export default function collectionReducer(
  state: ICollectionState = { collections: {} },
  { type, ...payload }: ICollectionAction
): ICollectionState {
  switch (type) {
    case CollectionAction.UpsertSucceeded:
      return _.set(
        { ...state },
        `collections['${payload.collection._id}']`,
        payload.collection
      );
    case CollectionAction.UpsertFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
