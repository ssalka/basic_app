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
import {
  addField,
  removeField,
  toggleRequired,
  toggleIsArray,
} from './handlers';

type FieldOptionsEnum = 'required' | 'isArray' | 'renderMethod';

interface IProps extends ReactProps {
  collection: Partial<Collection>;
  handleChange(index: number, updates: Partial<Field>): void;
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

  private handlers: IFunctionModule = this.bindModule({
    addField,
    removeField,
    toggleRequired,
    toggleIsArray,
  });

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

  editFormFields() {
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

  public render() {
    const {
      props: {
        collection
      },
      state: {
        editingFields,
        showFieldOptions
      }
    } = this;

    const onlyOneField: boolean = collection.fields.length === 1;
    const OptionButton: SFC = (props: any): ReactElement => (
      <div className="option-button">
        {editingFields
          ? <RemoveFieldButton disabled={onlyOneField} onClick={this.handlers.removeField} />
          : <DetailsButton onClick={() => this.toggleFieldOptions(props.index)} />}
      </div>
    );

    return (
      <div className="form-main">
        <FlexRow className="subheader" alignItems="center">
          <h5>Schema</h5>
          <ToggleEditButton editingFields={editingFields} onClick={this.editFormFields} />
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
                <OptionButton index={index} />
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

        {!editingFields && <AddFieldButton onClick={this.handlers.addField} />}
      </div>
    );
  }
}
