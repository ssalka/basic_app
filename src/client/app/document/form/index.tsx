declare const _;
declare const React;
import axios from 'axios';
import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { FIELD_TYPES } from 'lib/common/constants';
import { findDocumentById } from 'lib/common/helpers';
import { Collection, Field, ReactElement, IDocument, IRouteProps } from 'lib/client/interfaces';
import {
  ViewComponent,
  FlexRow,
  FlexColumn,
  Button,
  TextInput,
  NumericInput,
  CollectionSelect
} from 'lib/client/components';
import './styles.less';

export interface IProps extends Partial<IRouteProps> {
  collection: Collection;
  collections: Collection[];
}

interface IState {
  document: IDocument;
  documents?: IDocument[];
}

export default class DocumentForm extends ViewComponent<IProps, IState> {
  static defaultProps = {
    collection: {},
    collections: [],
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      document: _.get(props, 'location.state.document', {})
    };
  }

  upsertDocument = newDocument => {
    const {
      props: { collection },
      state: { document }
    } = this;

    return axios.post(`/api/collections/${collection._id}/documents/${document._id}`, { document: newDocument });
  }

  clearField = (field: Field) => () => {
    this.setStateByPath(`document.${_.camelCase(field.name)}`, undefined);
  }

  updateField = _.curry((field: Field, value: string & React.FormEvent<any>) => {
    if (value.currentTarget) {
      // TODO: transform TextInput onChange cb to pass a value instead of event
      value = value.currentTarget.value;
    }

    const nullableValue = value === '' ? null : value;
    const newValue = (
      field.type === 'NUMBER' && !_.isNull(nullableValue)
        ? parseInt(nullableValue, 10)
        : nullableValue
    );

    const valueAsArray = _(newValue || '')
      .split('; ')
      .compact();

    this.setStateByPath(
      `document.${_.camelCase(field.name)}`,
      field.isArray ? valueAsArray.value() : newValue
    );
  });

  updateCollectionField = _.curry((field: Field, collections: Collection[]) => {
    const newValue = field.isArray
      ? collections
      : collections[0];

    if (!field.isArray && _.isEmpty(newValue) || !(newValue as Collection)._id) {
      return console.error('A valid document is required for use in a collection field. Got', newValue);
    }

    this.setStateByPath(
      `document.${_.camelCase(field.name)}`,
      field.isArray ? _.map(newValue, '_id') : (newValue as Collection)._id
    );
  });

  getInput(field: Field): ReactElement {
    const documentValue: any = this.state.document[_.camelCase(field.name)];
    const inputValue: any = field.isArray ? (documentValue || []).join('; ') : documentValue;

    if (field._collection) {
      const collection = findDocumentById(this.props.collections, field._collection) as Collection;

      return (
        <CollectionSelect
          collection={collection}
          documents={this.state.documents || []}
          onChange={this.updateCollectionField(field)}
        />
      );
    }

    // TODO: support more input types, eg textarea, date/time picker, ...
    switch (field.type) {
      case 'NUMBER':
      return (
        <NumericInput
          value={inputValue}
          onChange={this.updateField(field)}
        />
      );
      case 'STRING':
      default:
        return (
          <TextInput
            value={inputValue}
            onChange={this.updateField(field)}
          />
        );
    }
  }

  getField = (field: Field) => (
    <FlexColumn className="document-field" key={field.name}>
      <label className="pt-label pt-inline">
        <strong className="field-name">
          {field.name}
        </strong>

        {this.getInput(field)}

        {field.type === 'NUMBER' && (
          <Button
            icon="cross"
            color="default"
            size="small"
            minimal={true}
            onClick={this.clearField(field)}
          />
        )}
      </label>
    </FlexColumn>
  )

  submitForm(event: React.FormEvent<any>) {
    const { collection, history }: Partial<IProps> = this.props;
    const { document: _document } = this.state;
    event.preventDefault();

    this.upsertDocument(_document)
      .then(({ data: updatedDocument }) => updatedDocument)
      .then(doc => this.setState({ document: doc }))
      .then(() => history.push(collection.path));
  }

  render() {
    const { collection } = this.props;

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="document-form" onSubmit={this.submitForm}>
            <div className="header">
              <FlexRow>
                <h3>Document Form</h3>
              </FlexRow>
            </div>
            <div className="form-main">
              <div className="fields">
                {collection.fields.map(this.getField)}
              </div>
            </div>
            <FlexRow className="fill-width">
              <Button text="Save" type="submit" color="success" onClick={this.submitForm} />
              <Button text="Cancel" color="danger" onClick={browserHistory.goBack} />
            </FlexRow>
          </form>
        </div>
      </ViewComponent>
    );
  }
}
