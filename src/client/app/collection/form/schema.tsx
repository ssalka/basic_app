declare const _;
declare const React;

import { EditableText } from '@blueprintjs/core';
import { ViewComponent, Button, FlexRow, FlexColumn } from 'lib/client/components';
import { Field, Collection } from 'lib/client/interfaces/collection';
import { ReactElement, ReactProps, SFC, IComponentModule, IFunctionModule } from 'lib/client/interfaces/react';
import {
  DetailsButton,
  RemoveFieldButton,
  ToggleEditButton,
  FieldNameInput,
  TypeSelectPopover,
  FieldOptions,
  AddFieldButton
} from './components';

type FieldOptionsEnum = 'required' | 'isArray' | 'renderMethod';

interface IProps extends ReactProps {
  collection: Partial<Collection>;
  handleChange(index: number, updates?: Partial<Field> | null): void;
}

interface IState {
  editingFields: boolean;
  showFieldOptions: boolean[];
}

export default class CollectionFormSchema extends ViewComponent<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    collection: new Collection({
      _id: null,
      fields: [new Field()]
    })
  };

  constructor(props: Partial<IProps>) {
    super(props);
    const collection = new Collection(props.collection);

    this.state = {
      editingFields: false,
      showFieldOptions: collection._id
        ? collection.fields.map(() => false)
        : [true]
    };
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.collection.fields.length < this.props.collection.fields.length) {
      // only show field options of the newly-created field
      this.setState({
        showFieldOptions: _(this.props.collection.fields)
          .map((field, i) => !i)
          .reverse()
          .value()
      });
    }
  }

  toggleEditingFields() {
    this._toggle('editingFields');
  }

  toggleFieldOptions(index: number) {
    const visibleFieldOptions = this.state.showFieldOptions.map(
      (isVisible, i) => (i === index) && !isVisible
    );
    this.setState({ showFieldOptions: visibleFieldOptions });
  }

  updateFieldName(index: number, name: string) {
    this.props.handleChange(index, { name });
  }

  updateFieldType(index: number, type: string) {
    this.props.handleChange(index, { type });
  }

  updateFieldOptions(index: number, newFieldOptions: Pick<Field, FieldOptionsEnum>) {
    this.props.handleChange(index, newFieldOptions);
  }

  addField() {
    const { fields } = this.props.collection;
    this.props.handleChange(fields.length);
  }

  removeField(index: number) {
    if (this.props.collection.fields.length !== 1) {
      this.props.handleChange(index, null);
    }
  }

  public render() {
    const {
      props: { collection },
      state: { editingFields, showFieldOptions }
    } = this;

    return (
      <div className="form-main">
        <FlexRow className="subheader" alignItems="center">
          <h5>Schema</h5>
          <ToggleEditButton editingFields={editingFields} onClick={this.toggleEditingFields} />
        </FlexRow>

        <div className="fields">
          {collection.fields.map((field: Field, index: number): ReactElement => (
            <FlexColumn key={index} className="field">
              <FlexRow className="field-main">
                <FieldNameInput
                  name={field.name}
                  onChange={newName => this.updateFieldName(index, newName)}
                />
                <TypeSelectPopover
                  onChange={newType => this.updateFieldType(index, newType)}
                  value={field.type}
                />
                <div className="option-button">
                  {editingFields
                    ? <RemoveFieldButton disabled={collection.fields.length === 1} onClick={() => this.removeField(index)} />
                    : <DetailsButton onClick={() => this.toggleFieldOptions(index)} />}
                </div>
              </FlexRow>

              {!editingFields && showFieldOptions[index] && (
                <FieldOptions
                  index={index}
                  field={field}
                  onChange={this.updateFieldOptions}
                />
              )}
            </FlexColumn>
          ))}
        </div>

        {!editingFields && <AddFieldButton onClick={this.addField} />}
      </div>
    );
  }
}
