import * as _ from 'lodash';
import * as React from 'react';

import { ViewComponent, FlexRow, FlexColumn } from 'lib/client/components';
import { CollectionField, Collection } from 'lib/common/interfaces/collection';
import { ReactElement, ReactProps } from 'lib/common/interfaces/react';
import { findFieldType, findDocumentById } from 'lib/common/helpers';
import {
  DetailsButton,
  RemoveFieldButton,
  ToggleEditButton,
  FieldNameInput,
  TypeSelectPopover,
  FieldOptions,
  AddFieldButton
} from './components';

interface IProps extends ReactProps {
  collection: Partial<Collection>;
  collections: Collection[];
  handleChange(index: number, updates?: Partial<CollectionField> | null): void;
}

interface IState {
  editingFields: boolean;
  showFieldOptions: boolean[];
}

export default class CollectionFormSchema extends ViewComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    collection: new Collection({
      _id: null,
      fields: [new CollectionField()]
    }),
    collections: []
  };

  constructor(props: Partial<IProps>) {
    super(props);
    const collection = new Collection(props.collection);

    this.state = {
      editingFields: false,
      showFieldOptions: collection._id ? collection.fields.map(() => false) : [true]
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
      (isVisible, i) => i === index && !isVisible
    );
    this.setState({ showFieldOptions: visibleFieldOptions });
  }

  getUpdateHandler = (index, key?) => value => {
    const update = key ? { [key]: value } : value;
    this.props.handleChange(index, update);
  }

  addField() {
    const { fields } = this.props.collection;
    this.props.handleChange(fields.length);
  }

  getRemoveFieldHandler = (index: number) => () => this.removeField(index);

  getToggleOptionsHandler = (index: number) => () => this.toggleFieldOptions(index);

  removeField(index: number) {
    if (this.props.collection.fields.length !== 1) {
      this.props.handleChange(index, null);
    }
  }

  render() {
    const {
      props: { collection, collections },
      state: { editingFields, showFieldOptions }
    } = this;

    return (
      <div className="form-main">
        <FlexRow className="subheader" alignItems="center">
          <h5>Schema</h5>
          <ToggleEditButton
            editingFields={editingFields}
            onClick={this.toggleEditingFields}
          />
        </FlexRow>

        <div className="fields">
          {collection.fields.map(
            (field: CollectionField, index: number): ReactElement => (
              <FlexColumn key={index} className="field">
                <FlexRow className="field-main">
                  <FieldNameInput
                    name={field.name}
                    onChange={this.getUpdateHandler(index, 'name')}
                  />
                  <TypeSelectPopover
                    collections={collections}
                    onChange={this.getUpdateHandler(index)}
                    selectedType={
                      findFieldType(field.type) ||
                      findDocumentById(collections, field._collection)
                    }
                  />
                  <div className="option-button">
                    {editingFields ? (
                      <RemoveFieldButton
                        disabled={collection.fields.length === 1}
                        onClick={this.getRemoveFieldHandler(index)}
                      />
                    ) : (
                      <DetailsButton onClick={this.getToggleOptionsHandler(index)} />
                    )}
                  </div>
                </FlexRow>

                {!editingFields &&
                  showFieldOptions[index] && (
                    <FieldOptions
                      index={index}
                      field={field}
                      onChange={this.getUpdateHandler(index)}
                    />
                  )}
              </FlexColumn>
            )
          )}
        </div>

        {!editingFields && <AddFieldButton onClick={this.addField} />}
      </div>
    );
  }
}
