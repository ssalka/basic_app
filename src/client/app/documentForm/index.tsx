import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'lib/client/api/store';
import { Collection, Field, ReactElement, IDocument } from 'lib/common/interfaces';
import {
  ReduxComponent,
  ViewComponent,
  FlexRow,
  FlexColumn,
  Button,
  TextInput,
  NumericInput,
  CollectionSelect
} from 'lib/client/components';
import './styles.less';

export interface IProps extends Partial<RouteComponentProps<any>> {
  collection: Collection;
}

interface IState {
  document: IDocument;
}

export class DocumentForm extends ReduxComponent<IProps, IState> {
  static defaultProps = {
    collection: {},
    collections: [],
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      document: _.get(props, 'location.state.document', {} as IDocument)
    };
  }

  clearField = (field: Field) => () => {
    this.setStateByPath(`document.${_.camelCase(field.name)}`, undefined);
  };

  updateField = _.curry((field: Field, value: string | React.FormEvent<any>) => {
    if ((value as React.FormEvent<any>).currentTarget) {
      // TODO: transform TextInput onChange cb to pass a value instead of event
      value = (value as React.FormEvent<any>).currentTarget.value;
    }

    const nullableValue: string = value === '' ? null : value as string;
    const newValue =
      field.type === 'NUMBER' && !_.isNull(nullableValue)
        ? parseInt(nullableValue, 10)
        : nullableValue;

    const valueAsArray = _((newValue as string) || '')
      .split('; ')
      .compact();

    this.setStateByPath(
      `document.${_.camelCase(field.name)}`,
      field.isArray ? valueAsArray.value() : newValue
    );
  });

  updateCollectionField = _.curry(
    (field: Field, newFieldValue: Collection | Collection[]): void => {
      if (_.isNull(newFieldValue)) {
        // value cleared by form
        return this.setStateByPath(`document.${_.camelCase(field.name)}`, []);
      }

      const collectionId = (newFieldValue as Collection)._id;
      const invalidCollectionField = !field.isArray && !collectionId;
      const invalidArrayField = field.isArray && !_.isArray(newFieldValue);

      if (invalidCollectionField || invalidArrayField) {
        return console.error(
          'A valid document is required for use in a collection field. Got',
          newFieldValue
        );
      }

      this.setStateByPath(
        `document.${_.camelCase(field.name)}`,
        field.isArray ? _.map(newFieldValue as Collection[], '_id') : collectionId
      );
    }
  );

  getLinkedDocuments(field: Field): IDocument | IDocument[] {
    const documents = this.props.store.documents.byCollection[this.props.collection._id];
    const { document: doc } = this.state;
    const _id: string = _.get(doc, _.camelCase(field.name));

    if (!(documents && _id)) {
      return [];
    }

    const search = field.isArray ? _.filter : _.find;

    return search(documents, { _id });
  }

  submitForm(event: React.FormEvent<any>) {
    const { collection, history }: Partial<IProps> = this.props;
    const { document: doc } = this.state;
    event.preventDefault();
    this.props.actions.upsertDocument(collection._id, doc);
  }

  getInput = (field: Field): ReactElement => {
    const documentValue: any = this.state.document[_.camelCase(field.name)];
    const inputValue: any = field.isArray
      ? (documentValue || []).join('; ')
      : documentValue;

    if (field._collection) {
      return (
        <CollectionSelect
          multi={field.isArray}
          labelKey={_.camelCase(this.props.collection.fields[0].name)}
          documents={
            this.props.store.documents.byCollection[this.props.collection._id] || []
          }
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
            key={field.name}
            value={inputValue}
            onChange={this.updateField(field)}
          />
        );
      case 'STRING':
      default:
        return (
          <TextInput
            key={field.name}
            value={inputValue}
            onChange={this.updateField(field)}
          />
        );
    }
  };

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
                {collection.fields.map((field: Field, i) => (
                  <FlexColumn className="document-field" key={i}>
                    <label className="pt-label pt-inline">
                      <strong className="field-name">{field.name}</strong>

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
              <Button
                text="Save"
                type="submit"
                color="success"
                onClick={this.submitForm}
              />
              <Button text="Cancel" color="danger" onClick={this.props.history.goBack} />
            </FlexRow>
          </form>
        </div>
      </ViewComponent>
    );
  }
}

export default connect(DocumentForm);
