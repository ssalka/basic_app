import * as _ from 'lodash';
import { Box } from 'grid-styled';
import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router';

import { connect } from 'lib/client/api/store';
import { ReduxComponent, Button, FlexRow } from 'lib/client/components';
import { Field, Collection } from 'lib/common/interfaces';
import { ReactProps } from 'lib/common/interfaces/react';

import CollectionFormHeader from './header';
import CollectionFormSchema from './schema';
import './styles.less';

interface IProps extends ReactProps, RouteComponentProps<any> {
  // initial state of collection
  collection: Partial<Collection>;
}

interface IState {
  // current state of collection
  collection: Partial<Collection>;
}

export class CollectionForm extends ReduxComponent<IProps, IState> {
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

    this.state = {
      collection: new Collection(props.collection)
    };
  }

  updateCollection(updates: Partial<Collection>) {
    this.setState({
      collection: {
        ...this.state.collection,
        ...updates
      }
    });
  }

  updateFieldInCollection(index: number, updates?: Partial<Field> | null) {
    const { fields } = this.state.collection;

    if (index === fields.length) {
      // add new field
      fields.push(new Field());
      this.updateCollection({ fields });
    } else if (_.isNull(updates)) {
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

    this.props.actions.upsertCollection(collection);
  }

  public render() {
    const { collections } = this.props.store.user.user.library;
    const { collection } = this.state;

    return (
      <Box p={20}>
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
              <Button
                text="Save"
                type="submit"
                color="success"
                onClick={this.submitForm}
              />
              <Button
                text="Cancel"
                color="danger"
                onClick={this.props.history.goBack}
              />
            </FlexRow>
          </form>
        </div>
      </Box>
    );
  }
}

export default connect(CollectionForm);
