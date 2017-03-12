declare const _;
declare const React;

import { ReactElement } from 'lib/client/interfaces';
import { EditableText, Checkbox, Menu } from '@blueprintjs/core';
import { Button, FlexRow, FlexColumn, Popover, TypeSelect } from 'lib/client/components';
import { FIELD_TYPES } from 'lib/common/constants';

export function CollectionNameInput({ value }) {
  const {
    state: { collection },
    handlers: { changeCollectionName }
  } = this;
  return (
    <h3>
      <EditableText
        value={collection.name}
        placeholder="New Collection"
        onChange={changeCollectionName}
      />
    </h3>
  );
}

export function DescriptionTextarea({ description }) {
  const handleChange = (value: string) => this.setStateByPath(
    'collection.description', value
  );

  return (
    <EditableText
      multiline={true}
      minLines={2}
      maxLines={4}
      value={description}
      placeholder="Description"
      onChange={handleChange}
    />
  );
}

export function FieldNameInput({ index, name }) {
  const handleChange = (value: string) => this.setStateByPath(
    `collection.fields[${index}].name`, value
  );

  return (
    <EditableText
      placeholder="New Field"
      value={name}
      onChange={handleChange}
    />
  );
}

export function TypeSelectPopover({ index, value, isOpen }) {
  const { selectType, toggleTypePopover } = this.handlers;
  const handleClick = () => toggleTypePopover(index);
  const handleSelectType = (type: string) => selectType(type, index);
  const selectedType = _.find(
    FIELD_TYPES.STANDARD,
    { key: value }
  );

  return (
    <Popover
      isOpen={isOpen}
      className="popover-type-select"
      target={(
        <Button
          text={selectedType.name || 'Select Type'}
          onClick={handleClick}
        />
      )}
    >
      <TypeSelect
        selectedType={selectedType.key}
        onSelectType={handleSelectType}
      />
    </Popover>
  );
}

export function ToggleEditButton() {
  const { editFormFields } = this.handlers;
  const props = this.state.editingFields
    ? { icon: 'tick', color: 'success' }
    : { icon: 'edit', color: 'warning' };

  return (
    <Button
      minimal={true}
      onClick={editFormFields}
      {...props}
    />
  );
}

export function AddFieldButton() {
  const { addField } = this.handlers;
  return (
    <FlexRow className="minimal-row">
      <Button
        onClick={addField}
        text="Add Field"
        icon="add"
        minimal={true}
        size="small"
      />
    </FlexRow>
  );
}

export function DetailsButton({ index }) {
  const handleClick = () => this.handlers.toggleFieldOptions(index);

  return (
    <Button
      icon="more"
      size="small"
      color="primary"
      onClick={handleClick}
    />
  );
}

export function RemoveFieldButton({ disabled }) {
  const { removeField } = this.handlers;

  return (
    <Button
      icon="minus"
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
  const handleCheckRequired = () => toggleRequired(index);
  const handleCheckIsArray = () => toggleIsArray(index);

  return (
    <FlexColumn className="field-options drawer bg-light">
      <h6 className="muted">Options for {fields[index].name || 'New Field'}</h6>
      <FlexRow justifyContent="space-around">
        <Checkbox checked={fields[index].required} onChange={handleCheckRequired}>
          Required
        </Checkbox>
        <Checkbox checked={fields[index].isArray} onChange={handleCheckIsArray}>
          Is Array
        </Checkbox>
      </FlexRow>
    </FlexColumn>
  );
}
