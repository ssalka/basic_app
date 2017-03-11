declare const _;
import api from 'lib/client/api';
import { Field } from 'lib/client/interfaces';

/**
 * NOTE
 * These functions are intended to be
 * bound to the SchemaForm component
 */

export function editFormFields() {
  this._toggle('editingFields');
}

export function addField() {
  const { collection } = this.state;
  collection.fields.push(new Field);
  this.setState({
    collection,
    selectingType: collection.fields.map(_.stubFalse),
    // only show field options of the newly-created field
    showFieldOptions: _(collection.fields)
      .map((field, i) => !i)
      .reverse()
      .value()
  });
}

export function removeField(index: number) {
  const { fields } = this.state.collection;
  if (fields.length === 1) return;

  fields.splice(index, 1);
  this.setStateByPath(
    'collection.fields', fields
  );
}

export function changeCollectionName(name: string) {
  const { collection } = this.state;
  collection.name = name;
  this.setState({ collection });
}

export function selectType(type: string, index: number) {
  const { collection, selectingType } = this.state;
  collection.fields[index].type = type;
  selectingType.splice(index, 1, !selectingType[index]);
  this.setState({ collection, selectingType });
}

export function toggleIconPopover() {
  this._toggle('selectingIcon');
}

export function toggleTypePopover(index: number) {
  const { collection,  selectingType } = this.state;
  this.setState({
    selectingType: collection.fields.map(
      (_, i) => i === index && !selectingType[index]
    )
  });
}

export function selectIcon(icon: string) {
  const { collection } = this.state;
  this.setState({
    collection: _.assign(collection, { icon }),
    selectingIcon: false
  });
}

export function toggleFieldOptions(index: number) {
  const visibleFieldOptions = this.state.showFieldOptions.map(
    (isVisible, i) => (i === index) && !isVisible
  );
  this.setStateByPath('showFieldOptions', visibleFieldOptions);
}

export function toggleRequired(index: number) {
  this._toggle(`collection.fields[${index}].required`);
}

export function toggleIsArray(index: number) {
  this._toggle(`collection.fields[${index}].isArray`);
}

export function submitForm(event) {
  const { collection } = this.state;
  event.preventDefault();

  this.props.upsertCollection(collection)
    .then(_.property('data.collection'))
    .then(coll => api.User.updateLibrary(coll) || coll)
    .then(coll => this.props.history.push(coll.path));
}
