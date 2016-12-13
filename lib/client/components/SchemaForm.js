import React from 'react';
import { createConnector } from 'cartiv';
import { ViewComponent } from '../components';
import { Button, EditableText } from '@blueprintjs/core';
import { FIELD_TYPES } from 'lib/common/constants';
import '../styles/SchemaForm.less';
import { UserStore } from 'lib/client/api/stores';

class Field {
  name = '';
  type = 'default';
}

const connect = createConnector(React);

const formHandlers = {
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

  changeFieldName(index, value) {
    // update model values in state
    const { collection } = this.state;
    collection.fields[index].name = value;
    this.setState({ collection });
  },

  changeFieldType(index, {currentTarget}) {
    const { value } = currentTarget;
    const { collection } = this.state;
    collection.fields[index].type = value;
    this.setState({ collection });
  },

  submitForm(event) {
    event.preventDefault();
    const { user, collection } = this.state;
    if (_.isEmpty(user)) return;

    // addCollection mutation here
  }
};


@connect(UserStore)
class SchemaForm extends ViewComponent {
  state = {
    collection: {
      name: '',
      fields: [new Field()]
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

    const getSelectOption = ({key, name}) => (
      <option key={key} value={name}>{name}</option>
    );

    return (
      <div className="pt-select">
        <select value={value} onChange={event => handlers.changeFieldType(index, event)}>
          <DefaultOption />
          {FIELD_TYPES.map(getSelectOption)}
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

        <div className="flex-row subheader">
          <h5>Schema</h5>
          <Button className="pt-minimal pt-icon-edit"
            onClick={handlers.editFormFields}
          ></Button>
        </div>

        {collection.fields.map(({name, type}, key) => (
          <div key={key} className="flex-row field">
            <EditableText placeholder={'New Field'} value={name}
              onChange={value => handlers.changeFieldName(key, value)}
            />
            <TypeSelect index={key} value={type} />
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

module.exports = SchemaForm;
