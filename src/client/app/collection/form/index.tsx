declare const _;
declare const React;

import { browserHistory } from 'react-router';
import { mutation } from 'lib/client/api/graphql';
import { connect, CollectionStore } from 'lib/client/api/stores';
import { SchemaFormMutation } from 'lib/client/api/graphql/mutations';
import { ViewComponent, Button, FlexRow, FlexColumn, IconSelector } from 'lib/client/components';
import { IMutationSettings, Field, Collection } from 'lib/client/interfaces';
import { ReactElement, ReactProps, IComponentModule, IFunctionModule } from 'lib/client/interfaces/react';
import { READONLY_FIELDS } from 'lib/common/constants';
import './styles.less';
import * as handlers from './handlers';
import * as components from './components';

const mutationSettings: IMutationSettings = {
  getVariables: (collection: Collection) => _(collection)
    .defaults({ _db: 'test' })
    .assign({
      fields: collection.fields.map(
        (field: Field) => _.omit(field, READONLY_FIELDS)
      )
    })
    .value(),
  variables: {}
};

interface IProps extends ReactProps {
  collection: Partial<Collection>;
}

interface IState {
  collection: Partial<Collection>;
  collections: Collection[];
  editingFields: boolean;
  selectingIcon: boolean;
  selectingType: boolean[];
  selectingView: boolean[];
  showFieldOptions: boolean[];
}

@connect(CollectionStore)
export class SchemaForm extends ViewComponent<IProps, IState> {
  public static defaultProps: IProps = {
    collection: new Collection({
      _id: null,
      name: '',
      fields: [new Field()],
      description: '',
      icon: 'graph'
    })
  };

  private handlers: IFunctionModule = this.bindModule(handlers);

  private components: IComponentModule = this.bindModule(components);

  constructor(props: Partial<IProps>) {
    super(props);
    const collection = new Collection(props.collection);
    const stubBooleanArray = (elseVal?: boolean): boolean[] => (
      collection._id ? collection.fields.map(() => false) : [!!elseVal]
    );

    this.state = {
      collection,
      collections: _.reject([collection], _.isEmpty),
      editingFields: false,
      selectingIcon: false,
      selectingType: stubBooleanArray(),
      selectingView: stubBooleanArray(),
      showFieldOptions: stubBooleanArray(true)
    };
  }

  public render() {
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

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="schema-form" onSubmit={submitForm}>
            <div className="header">
              <FlexRow>
                <CollectionNameInput value={name} />
                <IconSelector
                  selectedIcon={collection.icon}
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
                  <FlexColumn key={index} className="field">
                    <FlexRow className="field-main">
                      <FieldNameInput index={index} name={name} />
                      <TypeSelectPopover
                        index={index}
                        value={type}
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

            <FlexRow className="action-buttons fill-width">
              <Button text="Save" type="submit" size="large" color="success" onClick={submitForm} />
              <Button text="Cancel" size="large" color="danger" onClick={browserHistory.goBack} />
            </FlexRow>
          </form>
        </div>
      </ViewComponent>
    );
  }
}

export default mutation(SchemaFormMutation, mutationSettings)(SchemaForm);
