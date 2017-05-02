declare const _;
declare const React;

import { Field, IRenderMethod, ReactElement, SFC } from 'lib/client/interfaces';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { Button, FlexRow, FlexColumn, Popover, TypeSelect, ViewSelect } from 'lib/client/components';
import { FIELD_TYPES, RENDER_METHODS } from 'lib/common/constants';

export const CollectionNameInput: SFC = ({ name, handleChange }) => (
  <h3>
    <EditableText
      value={name}
      placeholder="New Collection"
      onChange={handleChange}
    />
  </h3>
);

export const DescriptionTextarea: SFC = ({ description, handleChange }) => (
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

export const ToggleEditButton: SFC = ({ editingFields, onClick }) => {
  const props = editingFields
    ? { icon: 'tick', color: 'success' }
    : { icon: 'edit', color: 'warning' };

  return (
    <Button
      minimal={true}
      onClick={onClick}
      {...props}
    />
  );
};

export const FieldNameInput: SFC = ({ name, onChange }) => (
  <EditableText
    placeholder="New Field"
    value={name}
    onChange={onChange}
  />
);

export const TypeSelectPopover: SFC = ({ onChange, onToggle, value }) => {
  const selectedType = _.find(
    FIELD_TYPES.STANDARD,
    { key: value }
  );
  const SelectTypeButton: ReactElement = (
    <Button
      text={selectedType.name || 'Select Type'}
      onClick={onToggle}
    />
  );

  return (
    <Popover
      className="popover-type-select"
      target={SelectTypeButton}
    >
      <TypeSelect
        selectedType={selectedType.key}
        onSelectType={onChange}
      />
    </Popover>
  );
}

export const DetailsButton: SFC = ({ onClick }) => (
  <Button
    icon="more"
    size="small"
    color="primary"
    onClick={onClick}
  />
);

export const RemoveFieldButton: SFC = ({ disabled, onClick }) => (
  <Button
    icon="minus"
    size="small"
    color="danger"
    onClick={onClick}
    disabled={disabled}
  />
);

export const FieldOptions: SFC = ({ index, field, onChange, onTogglePopover }: any) => {
  const handleCheckRequired = () => onChange(index, { required: !field.required });
  const handleCheckIsArray = () => onChange(index, { isArray: !field.isArray });
  const handleSelectView = (renderMethod: IRenderMethod) => onChange(index, { renderMethod: renderMethod.key });
  const renderMethod: IRenderMethod = _.find(RENDER_METHODS, { key: field.renderMethod }) || RENDER_METHODS[0];

  return (
    <FlexColumn className="field-options drawer bg-light">
      <h6 className="muted">Options for {field.name || 'New Field'}</h6>
      <FlexRow justifyContent="space-around">
        <FlexColumn justifyContent="space-around">
          <ViewSelectPopover
            field={field}
            handleSelectView={handleSelectView}
            handleTogglePopover={onTogglePopover}
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

const ViewSelectPopover: SFC = ({ field, handleSelectView, handleTogglePopover }) => {
  const selectedView: IRenderMethod | undefined = _.find(RENDER_METHODS, { key: field.renderMethod });
  const isValidRenderMethod = (renderMethod: IRenderMethod): boolean => (
    _.includes([field.type, 'MIXED'], renderMethod.inputType)
  );
  const SelectViewButton: ReactElement = (
    <Button
      text={_.get(selectedView, 'name', 'Select View')}
      onClick={handleTogglePopover}
    />
  );

  return (
    <Popover
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
};

export const AddFieldButton: SFC = ({ onClick }) => (
  <FlexRow className="minimal-row">
    <Button
      onClick={onClick}
      text="Add Field"
      icon="add"
      minimal={true}
      size="small"
    />
  </FlexRow>
);
