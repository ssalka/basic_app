import React from 'react';
import { ViewComponent } from '../components';
import { FIELD_TYPES } from 'lib/common/constants';
import { Button, EditableText, Popover, Position, Menu, MenuItem } from '@blueprintjs/core';
import '../styles/SchemaForm.less';

const newField = {
  name: '',
  type: 'String'
};

class SchemaForm extends ViewComponent {
  state = {
    collection: {
      collectionName: '',
      fields: [newField]
    }
  }

  addField() {
    const { collection } = this.state;
    collection.fields.push(newField);
    this.setState({ collection });
  }

  handleSelect(index, { currentTarget }) {
    const { value } = currentTarget;
    const { collection } = this.state;
    collection.fields[index].type = value;
    console.info('updated field', collection.fields[index]);
    this.setState({ collection });
  }

  TypeSelect({ index }) {
    return (
      <div className="pt-select">
       <select value={this.state.collection.fields[index].type}
         onChange={event => this.handleSelect(index, event)}>
         {FIELD_TYPES.map((value, key) => (
           <option key={key} value={value}>{value}</option>
         ))}
       </select>
      </div>
    );
  }

  handleChange(index, value) {
    // update model values in state
    const { collection } = this.state;
    collection.fields[index].name = value;
    console.info('updated field', collection.fields[index]);
    this.setState({ collections });
  }

  handleSubmit(event) {
    event.preventDefault();

    // validate & send to server via graphql
  }

  render() {
    const {
      state: { collection },
      handleSubmit, TypeSelect
    } = this;

    return (
      <form name="schema-form" onSubmit={handleSubmit} className="pt-card pt-elevation-3">
        <h3>
        <EditableText
          placeholder={'New Collection'}
          value={collection.name}
          onChange={/* TODO */}
        />
        </h3>

        <div className="subheader flex-row">
          <h5>Schema</h5>
          <Button className="pt-minimal pt-icon-edit"></Button>
        </div>
        {collection.fields.map(({name, type}, key) => (
          <div key={key} className="field flex-row">
            <EditableText
              placeholder={'New Field'}
              onChange={value => this.handleChange(key, value)}
              value={name}
            />
          <TypeSelect index={key} />
          </div>
        ))}
        <div className="button-list flex-row">
          <Button className="pt-minimal pt-icon-add" onClick={this.addField}>Add Field</Button>
        </div>
        <div className="button-list flex-row">
          <Button type="submit" className="pt-large pt-intent-success">Save</Button>
          <Button className="pt-large pt-intent-danger">Cancel</Button>
        </div>
      </form>
    );
  }
}

module.exports = SchemaForm;
