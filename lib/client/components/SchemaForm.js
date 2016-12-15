import React from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent, Button } from '../components';
import { EditableText } from '@blueprintjs/core';
import { FIELD_TYPES } from 'lib/common/constants';
import '../styles/SchemaForm.less';

class Field {
  name = '';
  type = 'String';
}

const formHandlers = getFormHandlers();

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
    editing: false,
    collection: {
      name: '',
      fields: [new Field()],
      description: ''
    }
  };

  get handlers() {
    return _.mapValues(formHandlers, handler => handler.bind(this));
  }

  TypeSelect({index, value}) {
    const { handlers } = this;

    return (
      <div className="pt-select">
        <select value={value} onChange={event => {
          const _value = event.currentTarget.value;
          this.setStateByPath(
            `collection.fields[${index}].type`, _value
          );
        }}>
          {FIELD_TYPES.map(({key, name}) => (
            <option key={key} value={name}>{name}</option>
          ))}
        </select>
      </div>
    );
  }

  ToggleEditButton() {
    const { handlers } = this;

    const props = this.state.editing
      ? { icon: 'tick', color: 'success' }
      : { icon: 'edit', color: 'warning' };
    return (
      <Button minimal={true} rounded={true} {...props}
        onClick={handlers.editFormFields}
      ></Button>
    );
  }

  render() {
    const {
      state: { collection, editing },
      TypeSelect, ToggleEditButton, handlers
    } = this;

    return (
      <div id="schema-form" className="pt-card pt-elevation-3">
        <form name="schema-form" onSubmit={handlers.submitForm}>
          <div className="header">
            <h3>
              <EditableText value={collection.name}
                placeholder="New Collection"
                onChange={handlers.changeCollectionName}
              />
            </h3>

            <EditableText multiline minLines={2} maxLines={4}
              value={collection.description}
              placeholder="Description"
              onChange={value => this.setStateByPath(
                'collection.description', value
              )}
            />
          </div>

          <div id="schema">
            <div className="flex-row subheader">
              <h5>Schema</h5>
              <ToggleEditButton />
            </div>

            <div className="scroll">
              {collection.fields.map(({name, type}, index) => (
                <div key={index} className="flex-row field">
                  <EditableText placeholder="New Field" value={name}
                    onChange={value => this.setStateByPath(
                      `collection.fields[${index}].name`, value
                    )}
                  />
                  <TypeSelect index={index} value={type} />
                    <div className="option-button">
                      {editing ? (
                        <Button icon="minus"
                          rounded={true}
                          size="small"
                          color="danger"
                          onClick={handlers.removeField}
                          disabled={collection.fields.length === 1}
                        ></Button>
                      ) : (
                        <Button icon="more"
                          rounded={true}
                          size="small"
                          color="primary"
                        ></Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editing ? null : (
            <div className="flex-row minimal-row">
              <Button size="small" minimal={true} icon="add" onClick={handlers.addField}>
                Add Field
              </Button>
            </div>
          )}

          <div className="flex-row fill-width">
            <Button type="submit" size="large" color="success">Save</Button>
            <Button size="large" color="danger" onClick={browserHistory.goBack}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }
}

function getFormHandlers() {
  return {
    editFormFields() {
      this.setState({
        editing: !this.state.editing
      });
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
