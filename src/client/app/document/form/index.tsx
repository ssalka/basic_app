declare const _;
declare const React;
import axios from 'axios';
import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { FIELD_TYPES } from 'lib/common/constants';
import { findDocumentById } from 'lib/common/helpers';
import { Collection, Field, ReactElement, IDocument, IRouteProps } from 'lib/common/interfaces';
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

  updateCollectionField = _.curry((field: Field, newFieldValue: Collection | Collection[]): void => {
    if (_.isNull(newFieldValue)) {
      // value cleared by form
      return this.setStateByPath(`document.${_.camelCase(field.name)}`, []);
    }

    const collectionId = (newFieldValue as Collection)._id;
    const invalidCollectionField = !field.isArray && !collectionId;
    const invalidArrayField = field.isArray && !_.isArray(newFieldValue);

    if (invalidCollectionField || invalidArrayField) {
      return console.error('A valid document is required for use in a collection field. Got', newFieldValue);
    }

    this.setStateByPath(
      `document.${_.camelCase(field.name)}`,
      field.isArray ? _.map(newFieldValue, '_id') : collectionId
    );
  });

  getLinkedDocuments(field: Field): IDocument | IDocument[] {
    const { document: doc, documents } = this.state;
    const _id = _.get(doc, _.camelCase(field.name));

    if (!(documents && _id)) {
      return [];
    }

    const search = field.isArray ? _.filter : _.find;

    return search(this.state.documents, { _id });
  }

  submitForm(event: React.FormEvent<any>) {
    const { collection, history }: Partial<IProps> = this.props;
    const { document: _document } = this.state;
    event.preventDefault();

    this.upsertDocumentInCollection(collection, _document)
      .then(({ data: updatedDocument }) => updatedDocument)
      .then(doc => this.setState({ document: doc }))
      .then(() => history.push(collection.path));
  }

  upsertDocumentInCollection = (collection: Collection, doc: IDocument) => (
    axios.post(`/api/collections/${collection._id}/documents/${doc._id}`, { document: doc })
  )

  getInput(field: Field): ReactElement {
    const documentValue: any = this.state.document[_.camelCase(field.name)];
    const inputValue: any = field.isArray ? (documentValue || []).join('; ') : documentValue;

    if (field._collection) {
      const collection = findDocumentById(this.props.collections, field._collection) as Collection;

      return (
        <CollectionSelect
          multi={field.isArray}
          labelKey={_.camelCase(this.props.collection.fields[0].name)}
          documents={this.state.documents || []}
          value={this.getLinkedDocuments(field)}
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
                {collection.fields.map((field: Field) => (
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
                ))}
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
