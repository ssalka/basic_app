declare const _;
declare const React;

import { ViewComponent, Button, FlexRow, FlexColumn, IconSelector } from '../components';
import { browserHistory } from 'react-router';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { User } from 'lib/client/api';
import { mutation } from 'lib/client/api/graphql';
import { SchemaFormMutation } from 'lib/client/api/graphql/mutations';
import { MutationSettings, ReactElement, Field, Collection } from 'lib/client/interfaces';
import { FIELD_TYPES, READONLY_FIELDS } from 'lib/common/constants';
import 'lib/client/styles/SchemaForm.less';

const mutationSettings: MutationSettings = {
  getVariables: collection => _(collection)
    .defaults({ _db: 'test' })
    .assign({
      fields: collection.fields.map(
        field => _.omit(field, READONLY_FIELDS)
      )
    })
    .value(),
  variables: {}
};

type Props = React.Props<any> & {
  collection: Partial<Collection>;
};

interface State {
  collection: Partial<Collection>;
  selectingIcon: boolean;
  editingFields: boolean;
  showFieldOptions: boolean[];
}

@mutation(SchemaFormMutation, mutationSettings)
class SchemaForm extends ViewComponent {
  static defaultProps: Props = {
    collection: new Collection({
      _id: null,
      name: '',
      fields: [new Field],
      description: '',
      icon: 'graph'
    })
  };

  state: State = {
    collection: {},
    selectingIcon: false,
    editingFields: false,
    showFieldOptions: [true]
  };

  constructor({ collection }) {
    super({ collection });
    _.assign(this.state, {
      collection: new Collection(collection),
      showFieldOptions: collection._id
        ? collection.fields.map(() => false)
        : [true]
    });
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
      handlers: {
        submitForm,
        toggleIconPopover,
        toggleFieldOptions,
        selectIcon
      },
      state: {
        collection,
        editingFields,
        selectingIcon,
        showFieldOptions
      },
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

    const onlyOneField: boolean = collection.fields.length === 1;
    const OptionButton = (props: any): ReactElement => (
      <div className="option-button">
        {editingFields
          ? <RemoveFieldButton disabled={onlyOneField} {...props} />
          : <DetailsButton {...props} />}
      </div>
    );

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="schema-form" onSubmit={submitForm}>
            <div className="header">
              <FlexRow>
                <CollectionNameInput value={name} />
                <IconSelector selected={collection.icon}
                  onSelectIcon={selectIcon}
                  onClick={toggleIconPopover}
                  isOpen={selectingIcon}
                />
              </FlexRow>
              <DescriptionTextarea description={collection.description} />
            </div>
            <div className="form-main">
              <FlexRow className="subheader" alignItems="center">
                <h5>Schema</h5>
                <ToggleEditButton />
              </FlexRow>

              <div className="fields">
                {collection.fields.map(({name, type}: Field, index: number): ReactElement => (
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
      </ViewComponent>
    );
  }
}

function getComponents(): {
  [key: string]: (input?: any) => ReactElement
} {
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
          onChange={(value: string) => this.setStateByPath(
            'collection.description', value
          )}
        />
      );
    },

    FieldNameInput({ index, name }) {
      return (
        <EditableText placeholder="New Field" value={name}
          onChange={(value: string) => this.setStateByPath(
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
        <FlexColumn className="field-options drawer bg-light">
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

function getFormHandlers(): {
  [key: string]: (...args: any[]) => void
} {
  return {
    editFormFields() {
      this._toggle('editingFields');
    },

    addField() {
      const { collection } = this.state;
      collection.fields.push(new Field);
      this.setState({
        collection,
        // only show field options of the newly-created field
        showFieldOptions: _(collection.fields)
          .map((field, i) => !i)
          .reverse()
          .value()
      });
    },

    removeField(index: number) {
      const { fields } = this.state.collection;
      if (fields.length === 1) return;

      fields.splice(index, 1);
      this.setStateByPath(
        'collections.fields', fields
      );
    },

    changeCollectionName(name: string) {
      const { collection } = this.state;
      collection.name = name;
      this.setState({ collection });
    },

    selectType(event, index: number) {
      const { value: type } = event.currentTarget;
      this.setStateByPath(
        `collection.fields[${index}].type`, type
      );
    },

    toggleIconPopover() {
      this._toggle('selectingIcon');
    },

    selectIcon(icon: string) {
      const { collection } = this.state;
      this.setState({
        collection: _.assign(collection, { icon }),
        selectingIcon: false
      });
    },

    toggleFieldOptions(index: number) {
      const visibleFieldOptions = this.state.showFieldOptions.map(
        (isVisible, i) => (i === index) && !isVisible
      );
      this.setStateByPath('showFieldOptions', visibleFieldOptions);
    },

    toggleRequired(index: number) {
      this._toggle(`collection.fields[${index}].required`);
    },

    toggleIsArray(index: number) {
      this._toggle(`collection.fields[${index}].isArray`);
    },

    submitForm(event) {
      const { collection } = this.state;
      event.preventDefault();

      this.props.upsertCollection(collection)
        .then(({ data }) => data.collection)
        .then(coll => User.updateLibrary(coll) || coll)
        .then(coll => this.props.history.push(`/${coll.path}`));
    }
  };
}

export default SchemaForm;
