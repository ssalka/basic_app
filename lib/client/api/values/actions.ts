import { Action, ActionCreator } from 'redux';

import { Value } from 'lib/common/interfaces';

export interface IValueAction extends Action {
  value?: Value;
  error?: {
    status: number;
    message: string;
  };
}

export const enum ValueAction {
  CreateRequested = 'CREATE_VALUE_REQUESTED',
  CreateSucceeded = 'CREATE_VALUE_SUCCEEDED',
  CreateFailed = 'CREATE_VALUE_FAILED'
}

export const createValue: ActionCreator<IValueAction> = (value: Value) => ({
  type: ValueAction.CreateRequested,
  value
});

export default {
  createValue
};
