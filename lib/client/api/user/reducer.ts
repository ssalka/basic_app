import axios from 'axios';
import * as _ from 'lodash';
import { Collection, IUser } from 'lib/common/interfaces';
import { IUserAction, UserAction } from './actions';

interface IUserState {
  error?: {
    status: number;
    message: string;
  };
  user?: IUser;
}

function updateLibrary(state: IUserState, newCollection: Collection) {
  if (newCollection._model === 'Collection') {
    const collectionIndex = _.findIndex(state.user.library.collections, {
      _id: newCollection._id
    });

    const newState = { ...state };

    if (collectionIndex === -1) {
      newState.user.library.collections.push(newCollection);
    } else {
      newState.user.library.collections[collectionIndex] = newCollection;
    }

    return newState;
  }
}

export default function userReducer(
  state: IUserState = {},
  { type, ...payload }: IUserAction
): IUserState {
  switch (type) {
    case UserAction.LoginSucceeded:
    case UserAction.FetchSucceeded:
      return { ...state, user: payload.user };
    case UserAction.UpdateLibrary:
      return updateLibrary(state, payload.collection);
    case UserAction.LogoutSucceeded:
      return _.omit(state, 'user');
    case UserAction.FetchFailed:
    case UserAction.LogoutFailed:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
