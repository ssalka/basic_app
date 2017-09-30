declare const _;
declare const React;

import axios from 'axios';
import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { connect, CollectionStore } from 'lib/client/api/stores';
import { ViewComponent, Button, FlexRow } from 'lib/client/components';
import { Field, Collection } from 'lib/client/interfaces';
import { ReactProps, IRouteProps, IFunctionModule } from 'lib/client/interfaces/react';
import { READONLY_FIELDS } from 'lib/common/constants';
import CollectionFormHeader from './header';
import CollectionFormSchema from './schema';
import './styles.less';

interface IProps extends ReactProps, IRouteProps {
  collection: Partial<Collection>;
}

interface IState {
  collection: Partial<Collection>;
  collections?: Collection[];
}

export class CollectionForm extends ViewComponent<IProps, IState> {
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

  updateFieldInCollection(index: number, updates?: Partial<Field> | null) {
    const { fields } = this.state.collection;

    if (index === fields.length) {
      // add new field
      fields.push(new Field());
      this.updateCollection({ fields });
    }
    else if (_.isNull(updates)) {
      // remove a field
      fields.splice(index, 1);
      this.updateCollection({ fields });
    }

    const field = _.assign({}, fields[index], updates);
    this.setStateByPath(`collection.fields[${index}]`, field);
  }

  upsertCollection?(collection: Partial<Collection>): Promise<Collection>;

  submitForm(event) {
    const { collection } = this.state;
    event.preventDefault();

    axios.post(`/api/collections/${collection._id}`, collection)
      .then(({ data: coll }) => (
        api.User.updateLibrary(coll),
        this.props.history.push(coll.path)
      ))
      .catch(console.error);
  }

  public render() {
    const { collection, collections } = this.state;

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="schema-form" onSubmit={this.submitForm}>
            <CollectionFormHeader
              collection={collection}
              handleChange={this.updateCollection}
            />

            <CollectionFormSchema
              collection={collection}
              collections={collections}
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

export default connect(CollectionStore)(CollectionForm);
