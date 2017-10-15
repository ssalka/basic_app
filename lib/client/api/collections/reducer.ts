import axios from 'axios';
import * as _ from 'lodash';
import { Collection } from 'lib/common/interfaces';
import { ICollectionAction, CollectionAction } from './actions';

interface ICollectionState {
  collection?: Collection;
  error?: {
    status: number;
    message: string;
  };
}

export default function collectionReducer(
  state: ICollectionState = {},
  { type, ...payload }: ICollectionAction
): ICollectionState {
  switch (type) {
    case CollectionAction.UpsertSucceeded:
      return { ...state, collection: payload.collection };
    case CollectionAction.UpsertFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
