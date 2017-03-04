declare const _;
declare const React;

import { ReactElement } from 'lib/client/interfaces';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { Button, FlexRow, FlexColumn } from 'lib/client/components';
import { FIELD_TYPES } from 'lib/common/constants';

export function CollectionNameInput({ value }) {
  const {
    state: { collection },
    handlers: { changeCollectionName }
  } = this;
  return (
    <h3>
      <EditableText value={collection.name}
        placeholder="New Collection"
        onChange={changeCollectionName}
      />
    </h3>
  );
}

export function DescriptionTextarea({ description }) {
  return (
    <EditableText multiline minLines={2} maxLines={4}
      value={description}
      placeholder="Description"
      onChange={(value: string) => this.setStateByPath(
        'collection.description', value
      )}
    />
  );
}

export function FieldNameInput({ index, name }) {
  return (
    <EditableText placeholder="New Field" value={name}
      onChange={(value: string) => this.setStateByPath(
        `collection.fields[${index}].name`, value
      )}
    />
  );
}

export function TypeSelect({ index, value }) {
  const { selectType } = this.handlers;
  const { key: _value } = _.find(FIELD_TYPES, {
    key: _.words(value).join('').toUpperCase()
  });

  return (
    <div className="pt-select">
      <select value={_value} onChange={
        event => selectType(event, index)
      }>
        {FIELD_TYPES.map(({key, name}) => (
          <option key={key} value={key}>{name}</option>
        ))}
      </select>
    </div>
  );
}

export function ToggleEditButton() {
  const { editFormFields } = this.handlers;
  const props = this.state.editingFields
    ? { icon: 'tick', color: 'success' }
    : { icon: 'edit', color: 'warning' };

  return (
    <Button minimal={true}
      onClick={editFormFields} {...props}
    />
  );
}

export function AddFieldButton() {
  const { addField } = this.handlers;
  return (
    <FlexRow className="minimal-row">
      <Button onClick={addField}
        text="Add Field"
        icon="add"
        minimal={true}
        size="small"
      />
    </FlexRow>
  );
}

export function DetailsButton({ index }) {
  const { toggleFieldOptions } = this.handlers;
  return (
    <Button icon="more"
      size="small"
      color="primary"
      onClick={() => toggleFieldOptions(index)}
    />
  );
}

export function RemoveFieldButton({ disabled }) {
  const { removeField } = this.handlers;
  return (
    <Button icon="minus"
      size="small"
      color="danger"
      onClick={removeField}
      disabled={disabled}
    />
  );
}

export function FieldOptions({ index }) {
  const {
    handlers: { toggleRequired, toggleIsArray },
    state: { collection: { fields } }
  } = this;
  return (
    <FlexColumn className="field-options drawer bg-light">
      <h6 className="muted">Options for {fields[index].name || 'New Field'}</h6>
      <FlexRow justifyContent="space-around">
        <Checkbox checked={fields[index].required} onChange={() => toggleRequired(index)}>
          Required
        </Checkbox>
        <Checkbox checked={fields[index].isArray} onChange={() => toggleIsArray(index)}>
          Is Array
        </Checkbox>
      </FlexRow>
    </FlexColumn>
  );
}
