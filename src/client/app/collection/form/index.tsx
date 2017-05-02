declare const _;
declare const React;

import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { mutation } from 'lib/client/api/graphql';
import { connect, CollectionStore } from 'lib/client/api/stores';
import { SchemaFormMutation } from 'lib/client/api/graphql/mutations';
import { ViewComponent, Button, FlexRow } from 'lib/client/components';
import { IMutationSettings, Field, Collection } from 'lib/client/interfaces';
import { ReactProps, IRouteProps, IFunctionModule } from 'lib/client/interfaces/react';
import { READONLY_FIELDS } from 'lib/common/constants';
import SchemaFormHeader from './header';
import CollectionFormSchema from './schema';
import './styles.less';

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

interface IProps extends ReactProps, IRouteProps {
  collection: Partial<Collection>;
  upsertCollection?: (collection: Partial<Collection>) => Promise<Collection>;
}

interface IState {
  collection: Partial<Collection>;
  collections?: Collection[];
}

export class SchemaForm extends ViewComponent<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    collection: new Collection({
      _id: null,
      name: '',
      fields: [new Field()],
      description: '',
      icon: 'graph'
    })
  };

  constructor(props: Partial<IProps>) {
    super(props);
    const collection = new Collection(props.collection);

    this.state = {
      collection,
      collections: _.reject([collection], _.isEmpty),
    };
  }

  updateCollection(updates: Partial<Collection>) {
    const collection = _.assign({}, this.state.collection, updates);
    this.setState({ collection });
  }

  updateFieldInCollection(index: number, updates: Partial<Field>) {
    const { fields } = this.state.collection;
    const field = _.assign({}, fields[index], updates);
    this.setStateByPath(`collection.fields[${index}]`, field);
  }

  submitForm(event) {
    const { collection } = this.props;
    event.preventDefault();

    this.props.upsertCollection(collection)
      .then(_.property('data.collection'))
      .then((coll: Collection) => api.User.updateLibrary(coll) || coll)
      .then((coll: Collection) => this.props.history.push(coll.path));
  }

  public render() {
    const { collection } = this.state;

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="schema-form" onSubmit={this.submitForm}>
            <SchemaFormHeader
              collection={collection}
              handleChange={this.updateCollection}
            />

            <CollectionFormSchema
              collection={collection}
              handleChange={this.updateFieldInCollection}
            />

            <FlexRow className="action-buttons fill-width">
              <Button text="Save" type="submit" size="large" color="success" onClick={this.submitForm} />
              <Button text="Cancel" size="large" color="danger" onClick={browserHistory.goBack} />
            </FlexRow>
          </form>
        </div>
      </ViewComponent>
    );
  }
}

export default _.flow([
  mutation(SchemaFormMutation, mutationSettings),
  connect(CollectionStore)
])(SchemaForm);
