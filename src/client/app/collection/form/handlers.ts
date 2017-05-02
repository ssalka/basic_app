declare const _;
import api from 'lib/client/api';
import { Collection, Field, IRenderMethod } from 'lib/client/interfaces';

/**
 * NOTE
 * These functions are intended to be
 * bound to CollectionFormSchema
 */

export function addField() {
  const { collection } = this.props;
  collection.fields.push(new Field());
  this.setState({
    collection,
    // only show field options of the newly-created field
    showFieldOptions: _(collection.fields)
      .map((field, i) => !i)
      .reverse()
      .value()
  });
}

export function removeField(index: number) {
  const { fields } = this.props.collection;
  if (fields.length === 1) {
    return;
  }

  fields.splice(index, 1);
  this.setStateByPath(
    'collection.fields', fields
  );
}

export function toggleRequired(index: number) {
  this._toggle(`collection.fields[${index}].required`);
}

export function toggleIsArray(index: number) {
  this._toggle(`collection.fields[${index}].isArray`);
}
