declare const _;
declare const React;

import { Field, IRenderMethod, ReactElement } from 'lib/client/interfaces';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { Button, FlexRow, FlexColumn, Popover, TypeSelect, ViewSelect } from 'lib/client/components';
import { FIELD_TYPES, RENDER_METHODS } from 'lib/common/constants';

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
      className="description"
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
  const SelectTypeButton: ReactElement = (
    <Button
      text={selectedType.name || 'Select Type'}
      onClick={handleClick}
    />
  );

  return (
    <Popover
      isOpen={isOpen}
      className="popover-type-select"
      target={SelectTypeButton}
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

export function FieldOptions({ index, selectingView }) {
  const {
    selectView,
    toggleRequired,
    toggleIsArray,
    toggleViewPopover
  } = this.handlers;
  const field: Field = this.state.collection.fields[index];
  const handleCheckRequired = () => toggleRequired(index);
  const handleCheckIsArray = () => toggleIsArray(index);
  const handleTogglePopover = () => toggleViewPopover(index);
  const handleSelectView = (renderMethod: IRenderMethod) => selectView(renderMethod, index);
  const renderMethod: IRenderMethod = _.find(RENDER_METHODS, { key: field.renderMethod }) || RENDER_METHODS[0];

  return (
    <FlexColumn className="field-options drawer bg-light">
      <h6 className="muted">Options for {field.name || 'New Field'}</h6>
      <FlexRow justifyContent="space-around">
        <FlexColumn justifyContent="space-around">
          <ViewSelectPopover
            field={field}
            isOpen={selectingView}
            handleSelectView={handleSelectView}
            handleTogglePopover={handleTogglePopover}
          />
        </FlexColumn>
        <div>
          <Checkbox checked={field.required} onChange={handleCheckRequired}>
            Required
          </Checkbox>
          <Checkbox checked={field.isArray} onChange={handleCheckIsArray}>
            Is Array
          </Checkbox>
        </div>
      </FlexRow>
    </FlexColumn>
  );
}

function ViewSelectPopover({ field, isOpen, handleSelectView, handleTogglePopover }) {
  const selectedView: IRenderMethod | undefined = _.find(RENDER_METHODS, { key: field.renderMethod });
  const isValidRenderMethod = (renderMethod: IRenderMethod): boolean => (
    _.includes([field.type, 'MIXED'], renderMethod.inputType)
  );
  const SelectViewButton: ReactElement = (
    <Button
      text={_.get(selectedView, 'name', 'Select Type')}
      onClick={handleTogglePopover}
    />
  );

  return (
    <Popover
      isOpen={isOpen}
      className="popover-view-select"
      target={SelectViewButton}
    >
      <ViewSelect
        renderMethods={RENDER_METHODS.filter(isValidRenderMethod)}
        selectedView={selectedView}
        onSelectView={handleSelectView}
      />
    </Popover>
  );
}
