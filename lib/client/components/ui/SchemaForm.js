import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { FIELD_TYPES } from 'lib/common/constants';
import { ViewComponent, Button, FlexRow, FlexColumn, IconSelector } from '../';
import 'lib/client/styles/SchemaForm.less';

class Field {
  name = '';
  type = 'STRING';
  required = false;
  isArray = false;
}

const SchemaFormMutations = gql`
  mutation SchemaFormMutations($_id: ID, $name: String!, $fields: [FieldInput!]!, $description: String) {
    updateOrCreateCollection(_id: $_id, name: $name, fields: $fields, description: $description) {
      name
      _collection
      description
      creator { _id username }
      fields { name type required isArray }
      _db
      icon
      defaultView { type }
    }
  }
`;

const getVariables = ({ _id, name, description, fields, _db = 'test' }) => ({
  _id, name, description, _db, fields: fields.map(
    field => _.omit(field, '__typename')
  )
});

@graphql(SchemaFormMutations, {
  props: ({ mutate }) => ({
    updateOrCreateCollection: collection => mutate({
      variables: getVariables(collection)
    })
  })
})
class SchemaForm extends ViewComponent {
  static defaultProps = {
    collection: {
      _id: null,
      name: '',
      fields: [new Field()],
      description: '',
      icon: 'graph'
    }
  };

  constructor(props) {
    super(props);

    const { collection } = props;

    this.state = {
      collection,
      selectingIcon: false,
      editingFields: false,
      showFieldOptions: collection._id
        ? collection.fields.map(() => false)
        : [true]
    };
  }

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
      handlers: { submitForm, toggleIconPopover, toggleFieldOptions, selectIcon },
      state: { collection, editingFields, selectingIcon, showFieldOptions },
      components: {
        CollectionNameInput,
        DescriptionTextarea,
        FieldNameInput,
        TypeSelect,
        ToggleEditButton,
        DetailsButton,
        AddFieldButton,
        RemoveFieldButton,
        FieldOptions
      }
    } = this;

    const onlyOneField = collection.fields.length === 1;
    const OptionButton = props => React.createElement(
      'div', { className: 'option-button' },
      editingFields
        ? <RemoveFieldButton disabled={onlyOneField} {...props} />
        : <DetailsButton {...props} />
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

            <div className="fields">
              {collection.fields.map(({name, type}, index) => (
                <FlexColumn key={index}>
                  <FlexRow className="field-main">
                    <FieldNameInput index={index} name={name} />
                    <TypeSelect index={index} value={type} />
                    <OptionButton index={index} />
                  </FlexRow>
                  {showFieldOptions[index] && !editingFields && <FieldOptions index={index} />}
                </FlexColumn>
              ))}
            </div>
          </div>

          {!editingFields && <AddFieldButton />}

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
    },

    ToggleEditButton() {
      const { editFormFields } = this.handlers;
      const props = this.state.editingFields
        ? { icon: 'tick', color: 'success' }
        : { icon: 'edit', color: 'warning' };

      return (
        <Button minimal={true}
          onClick={editFormFields} {...props}
        />
      );
    },

    AddFieldButton() {
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
    },

    DetailsButton({ index }) {
      const { toggleFieldOptions } = this.handlers;
      return (
        <Button icon="more"
          size="small"
          color="primary"
          onClick={() => toggleFieldOptions(index)}
        />
      );
    },

    RemoveFieldButton({ disabled }) {
      const { removeField } = this.handlers;
      return (
        <Button icon="minus"
          size="small"
          color="danger"
          onClick={removeField}
          disabled={disabled}
        />
      );
    },

    FieldOptions({ index }) {
      const {
        handlers: { toggleRequired, toggleIsArray },
        state: { collection: { fields } }
      } = this;
      return (
        <FlexColumn className="field-options bg-light">
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
      this.setState({
        collection,
        // only show field options of the newly-created field
        showFieldOptions: _(collection.fields)
          .map((field, i) => !i)
          .reverse()
          .value()
      });
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

    selectType(event, index) {
      const { value: type } = event.currentTarget;
      this.setStateByPath(
        `collection.fields[${index}].type`, type
      );
    },

    toggleIconPopover() {
      this._toggle('selectingIcon');
    },

    selectIcon(icon) {
      this.setStateByPath('collections.icon', icon);
      this._toggle('selectingIcon');
    },

    toggleFieldOptions(index) {
      const visibleFieldOptions = this.state.showFieldOptions.map(
        (isVisible, i) => (i === index) && !isVisible
      );
      this.setStateByPath('showFieldOptions', visibleFieldOptions);
    },

    toggleRequired(index) {
      this._toggle(`collection.fields[${index}].required`);
    },

    toggleIsArray(index) {
      this._toggle(`collection.fields[${index}].isArray`);
    },

    submitForm(event) {
      event.preventDefault();
      this.props.updateOrCreateCollection(this.state.collection).then(
        response => console.log('got response', response)
      );
    }
  };
}

module.exports = SchemaForm;
