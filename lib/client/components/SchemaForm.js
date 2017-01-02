import React from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent, FlexRow, Button, IconSelector } from '../components';
import { EditableText } from '@blueprintjs/core';
import { FIELD_TYPES } from 'lib/common/constants';
import '../styles/SchemaForm.less';

class Field {
  name = '';
  type = 'String';
}

const addCollectionMutation = gql`
  mutation addCollection($name: String, $fields: [FieldInput], $description: String) {
    addCollection(name: $name, fields: $fields, description: $description) {
      name
      _collection
      description
      creator { _id username }
      fields { name type }
      _db
      icon
      defaultView { type }
    }
  }
`;

const setTypeKey = field => _.assign(field, {
  type: _.find(FIELD_TYPES, { name: field.type }).key
});

@graphql(addCollectionMutation, {
  props: ({ mutate }) => ({
    addCollection: (name, fields, description, _db='test') => mutate({
      variables: {
        name, _db, description,
        fields: fields.map(
          setTypeKey
        )
      }
    })
  })
})
class SchemaForm extends ViewComponent {
  state = {
    editingFields: false,
    selectingIcon: false,
    collection: {
      name: '',
      fields: [new Field()],
      description: '',
      icon: 'graph'
    }
  };

  handlers = _.mapValues(
    getFormHandlers(),
    handler => handler.bind(this)
  );

  components = _.mapValues(
    getComponents(),
    handler => handler.bind(this)
  );

  render() {
    const {
      handlers: { submitForm, toggleIconPopover, selectIcon },
      state: { collection, editingFields, selectingIcon },
      components: {
        CollectionNameInput,
        DescriptionTextarea,
        FieldNameInput,
        TypeSelect,
        ToggleEditButton,
        DetailsButton,
        AddFieldButton,
        RemoveFieldButton
      }
    } = this;

    const onlyOneField = collection.fields.length === 1;
    const OptionButton = () => React.createElement(
      'div', { className: 'option-button' },
      editingFields
        ? <RemoveFieldButton disabled={onlyOneField} />
        : <DetailsButton />
    );

    return (
      <div id="schema-form" className="pt-card pt-elevation-3">
        <form name="schema-form" onSubmit={submitForm}>
          <div className="header">
            <FlexRow>
              <CollectionNameInput value={name} />
              <IconSelector onSelectIcon={selectIcon}
                onClick={toggleIconPopover}
                isOpen={selectingIcon}
              />
            </FlexRow>
            <DescriptionTextarea description={collection.description} />
          </div>

          <div id="schema">
            <FlexRow className="subheader">
              <h5>Schema</h5>
              <ToggleEditButton />
            </FlexRow>

            <div className="scroll">
              {collection.fields.map(({name, type}, index) => (
                <FlexRow key={index} className="field">
                  <FieldNameInput index={index} name={name} />
                  <TypeSelect index={index} value={type} />
                  <OptionButton />
                </FlexRow>
              ))}
            </div>
          </div>

          {editingFields ? null : <AddFieldButton />}

          <FlexRow className="fill-width">
            <Button text="Save" type="submit" size="large" color="success" onClick={submitForm} />
            <Button text="Cancel" size="large" color="danger" onClick={browserHistory.goBack} />
          </FlexRow>
        </form>
      </div>
    );
  }
}

function getComponents() {
  return {
    CollectionNameInput({ value }) {
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
    },

    DescriptionTextarea({ description }) {
      return (
        <EditableText multiline minLines={2} maxLines={4}
          value={description}
          placeholder="Description"
          onChange={value => this.setStateByPath(
            'collection.description', value
          )}
        />
      );
    },

    FieldNameInput({ index, name }) {
      return (
        <EditableText placeholder="New Field" value={name}
          onChange={value => this.setStateByPath(
            `collection.fields[${index}].name`, value
          )}
        />
      );
    },

    TypeSelect({ index, value }) {
      const { selectType } = this.handlers;
      return (
        <div className="pt-select">
          <select value={value} onChange={
            event => selectType(event, index)
          }>
            {FIELD_TYPES.map(({key, name}) => (
              <option key={key} value={name}>{name}</option>
            ))}
          </select>
        </div>
      );
    },

    ToggleEditButton() {
      const { editFormFields } = this.handlers;
      const props = this.state.editingFields
        ? { icon: 'tick', color: 'success' }
        : { icon: 'edit', color: 'warning' };
      return (
        <Button minimal={true} rounded={true}
          onClick={editFormFields} {...props}
        ></Button>
      );
    },

    AddFieldButton() {
      const { addField } = this.handlers;
      return (
        <FlexRow className="minimal-row">
          <Button size="small" minimal={true} icon="add" onClick={addField}>
            Add Field
          </Button>
        </FlexRow>
      );
    },

    DetailsButton() {
      return (
        <Button icon="more"
          rounded={true}
          size="small"
          color="primary"
        ></Button>
      );
    },

    RemoveFieldButton({ disabled }) {
      const { removeField } = this.handlers;
      return (
        <Button icon="minus"
          rounded={true}
          size="small"
          color="danger"
          onClick={removeField}
          disabled={disabled}
        ></Button>
      );
    }
  };
}

function getFormHandlers() {
  return {
    editFormFields() {
      this._toggle('editingFields');
    },

    addField() {
      const { collection } = this.state;
      collection.fields.push(new Field());
      this.setState({ collection });
    },

    removeField(index) {
      const { fields } = this.state.collection;
      if (fields.length === 1) return;

      fields.splice(index, 1);
      this.setStateByPath(
        'collections.fields', fields
      );
    },

    changeCollectionName(name) {
      const { collection } = this.state;
      collection.name = name;
      this.setState({ collection });
    },

    changeField(property, index, value) {
      const { collection } = this.state;
      collection.fields[index][property] = value;
      this.setState({ collection });
    },

    selectType(event, index) {
      const type = event.currentTarget.value;
      this.setStateByPath(
        `collection.fields[${index}].type`, type
      );
    },

    toggleIconPopover() {
      this._toggle('selectingIcon');
    },

    selectIcon(icon) {
      this.setStateByPath(
        'collections.icon', icon
      );
      this._toggle('selectingIcon');
    },

    submitForm(event) {
      event.preventDefault();
      const { name, fields, description, _db } = this.state.collection;

      this.props.addCollection(name, fields, description, _db).then(
        response => console.log('got response', response)
      );
    }
  };
}

module.exports = SchemaForm;
