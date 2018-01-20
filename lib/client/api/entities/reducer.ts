import * as _ from 'lodash';
import produce from 'immer';
import { reducer, success } from 'lib/client/services/utils';
import {
  Action,
  IEntity,
  IErrorPayload,
  Reducer,
  EntityDocument,
  CommandType,
  QueryType,
  RequestStatus,
  Recorded,
  IEvent2,
  IKeyValueField
} from 'lib/common/interfaces';
import { IFieldPayload, IFieldKeyPayload, IFieldValuePayload, IRenameEntityPayload } from './actions';

interface IEntityState {
  aggregate: Partial<IEntity>;
  entities: EntityDocument[];
  error?: {
    status: number;
    message: string;
  };
}

type AddEntityReducer = Reducer<IEntityState, {
  entity?: EntityDocument;
  entities?: EntityDocument[];
}>;

const addEntity: AddEntityReducer = (state, { entity, entities }) => ({
  ...state,
  entities: state.entities.concat(entities || (entity as EntityDocument))
});

type RenameEntityReducer = Reducer<IEntityState, {
  event: IEvent2 & Recorded<IRenameEntityPayload>
}>;

const renameEntity: RenameEntityReducer = (state, { event }) =>
  produce(state, ({ entities }) => {
    const entityIndex = _.findIndex(entities, { _id: event.entity });

    _.assign(entities[entityIndex], {
      name: event.newName,
      version: event.version
    });
  });

type AddFieldReducer = Reducer<IEntityState, IFieldPayload>;
type RemoveFieldReducer = Reducer<IEntityState, IFieldPayload>;

export const addField: AddFieldReducer = reducer((state, { field }) => {
  const fieldIndex = _.find(state.aggregate.fields, { _id: field });
  state.aggregate.fields.splice(fieldIndex, 1);
});

export const removeField: RemoveFieldReducer = reducer((state, { field }) => {
  state.aggregate.fields.push(field);
});

export const getFieldPropertySetter = (keyName: keyof IKeyValueField, options = { unset: false }): Reducer<IEntityState> =>
  reducer((state, { field, ...action }: Action<IFieldPayload>) => {
    const matchedField = _(state.aggregate.fields)
      .filter({ _id: field })
      .thru(_.first);

    if (options.unset) {
      matchedField.unset(keyName);
    }
    else {
      const newValue = action[keyName];
      matchedField.set(keyName, newValue);
    }
  });

type AddFieldKeyReducer = Reducer<IEntityState, IFieldKeyPayload>;
type ReplaceFieldKeyReducer = Reducer<IEntityState, IFieldKeyPayload>;
type RemoveFieldKeyReducer = Reducer<IEntityState, IFieldPayload>;
type AddFieldValueReducer = Reducer<IEntityState, IFieldValuePayload>;
type ReplaceFieldValueReducer = Reducer<IEntityState, IFieldValuePayload>;
type RemoveFieldValueReducer = Reducer<IEntityState, IFieldPayload>;

const addFieldKey: AddFieldKeyReducer = getFieldPropertySetter('key');
const replaceFieldKey: ReplaceFieldKeyReducer = getFieldPropertySetter('key');
const removeFieldKey: RemoveFieldKeyReducer = getFieldPropertySetter('key', { unset: true });
const addFieldValue: AddFieldValueReducer = getFieldPropertySetter('value');
const replaceFieldValue: ReplaceFieldValueReducer = getFieldPropertySetter('value');
const removeFieldValue: RemoveFieldValueReducer = getFieldPropertySetter('value', { unset: true });

export default function entityReducer(
  state: IEntityState = { entities: [], aggregate: {} },
  { type, error, ...action }: Action<IErrorPayload | any> // TODO: interfaces for success/fail action payloads
): IEntityState {
  switch (type) {
    case success(QueryType.FetchEntitiesByUser):
      return addEntity(state, action);

    case success(CommandType.CreateEntity):
      return addEntity(state, action);

    case success(CommandType.RenameEntity):
      return renameEntity(state, action);

    case CommandType.AddField:
      return addField(state, action);
    case CommandType.AddFieldKey:
      return addFieldKey(state, action);
    case CommandType.ReplaceFieldKey:
      return replaceFieldKey(state, action);
    case CommandType.RemoveFieldKey:
      return removeFieldKey(state, action);
    case CommandType.AddFieldValue:
      return addFieldValue(state, action);
    case CommandType.ReplaceFieldValue:
      return replaceFieldValue(state, action);
    case CommandType.RemoveFieldValue:
      return removeFieldValue(state, action);
    case CommandType.RemoveField:
      return removeField(state, action);

    default:
      return type.includes(RequestStatus.Fail) ? { ...state, error } : state;
  }
}
