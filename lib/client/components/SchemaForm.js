import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ViewComponent } from '../components';
import { Button, EditableText } from '@blueprintjs/core';
import { FIELD_TYPES } from 'lib/common/constants';
import '../styles/SchemaForm.less';

class Field {
  name = '';
  type = 'default';
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

    const DefaultOption = () => value === 'default' ? (
      <option value="default">Type</option>
    ) : null;

    return (
      <div className="pt-select">
        <select value={value} onChange={event => {
          const _value = event.currentTarget.value;
          handlers.setStateByPath(
            `collection.fields[${index}].type`, _value
          );
        }}>
          <DefaultOption />
          {FIELD_TYPES.map(({key, name}) => (
            <option key={key} value={name}>{name}</option>
          ))}
        </select>
      </div>
    );
  }

  render() {
    const {
      state: { collection },
      TypeSelect, handlers
    } = this;

    return (
      <form name="schema-form" onSubmit={handlers.submitForm} className="pt-card pt-elevation-3">
        <h3>
        <EditableText value={collection.name}
          placeholder={'New Collection'}
          onChange={handlers.changeCollectionName}
        />
        </h3>

        <EditableText multiline minLines={3} maxLines={6}
          value={collection.description}
          placeholder={'Description'}
          onChange={value => handlers.setStateByPath('collection.description', value)}
        />

        <div className="flex-row subheader">
          <h5>Schema</h5>
          <Button className="pt-minimal pt-icon-edit"
            onClick={handlers.editFormFields}
          ></Button>
        </div>

        {collection.fields.map(({name, type}, index) => (
          <div key={index} className="flex-row field">
            <EditableText placeholder={'New Field'} value={name}
              onChange={value => handlers.setStateByPath(
                `collection.fields[${index}].name`, value
              )}
            />
          <TypeSelect index={index} value={type} />
          </div>
        ))}

        <div className="flex-row button-list">
          <Button className="pt-minimal pt-icon-add" onClick={handlers.addField}>Add Field</Button>
        </div>
        <div className="flex-row fill-width button-list">
          <Button type="submit" className="pt-large pt-intent-success">Save</Button>
          <Button className="pt-large pt-intent-danger">Cancel</Button>
        </div>
      </form>
    );
  }
}

function getFormHandlers() {
  return {
    addField() {
      const { collection } = this.state;
      collection.fields.push(new Field());
      this.setState({ collection });
    },

    changeCollectionName(name) {
      const { collection } = this.state;
      collection.name = name;
      this.setState({ collection });
    },

    setStateByPath(path, value) {
      const state = _.cloneDeep(this.state);
      _.set(state, path, value);
      this.setState(state);
    },

    changeField(property, index, value) {
      const { collection } = this.state;
      collection.fields[index][property] = value;
      this.setState({ collection });
    },

    submitForm(event) {
      event.preventDefault();
      const { name, fields, description, _db } = this.state.collection;
      console.log(this.state.collection);

      this.props.addCollection(name, fields, description, _db).then(
        response => console.log('got response', response)
      );
    }
  };
}

module.exports = SchemaForm;
