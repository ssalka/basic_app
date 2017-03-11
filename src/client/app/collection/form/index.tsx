declare const _;
declare const React;

import { browserHistory } from 'react-router';
import { mutation } from 'lib/client/api/graphql';
import { SchemaFormMutation } from 'lib/client/api/graphql/mutations';
import { ViewComponent, Button, FlexRow, FlexColumn, IconSelector } from 'lib/client/components';
import { MutationSettings, ReactElement, Field, Collection } from 'lib/client/interfaces';
import { READONLY_FIELDS } from 'lib/common/constants';
import 'lib/client/styles/SchemaForm.less';
import * as handlers from './handlers';
import * as components from './components';

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
  editingFields: boolean;
  selectingIcon: boolean;
  selectingType: boolean[];
  showFieldOptions: boolean[];
}

@mutation(SchemaFormMutation, mutationSettings)
class SchemaForm extends ViewComponent<Props, State> {
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
    editingFields: false,
    selectingIcon: false,
    selectingType: [false],
    showFieldOptions: [true]
  };

  constructor({ collection }) {
    super({ collection });
    _.assign(this.state, {
      collection: new Collection(collection),
      selectingType: collection._id
        ? collection.fields.map(() => false)
        : [false],
      showFieldOptions: collection._id
        ? collection.fields.map(() => false)
        : [true]
    });
  }

  handlers = _.mapValues(
    handlers,
    handler => handler.bind(this)
  );

  components = _.mapValues(
    components,
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
        selectingType,
        showFieldOptions
      },
      components: {
        CollectionNameInput,
        DescriptionTextarea,
        FieldNameInput,
        TypeSelectPopover,
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

    const JSIconSelector = IconSelector as any;

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="schema-form" onSubmit={submitForm}>
            <div className="header">
              <FlexRow>
                <CollectionNameInput value={name} />
                <JSIconSelector selected={collection.icon}
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
                      <TypeSelectPopover index={index} value={type}
                        isOpen={selectingType[index]}
                      />
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

export default SchemaForm;
