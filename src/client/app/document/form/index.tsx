declare const _;
declare const React;
import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { ViewComponent, FlexRow, FlexColumn, Button, TextInput, NumericInput } from 'lib/client/components';
import { Collection, Field, ReactElement, IRouteProps } from 'lib/client/interfaces';
import { getGraphQLCollectionType } from 'lib/common/graphql';
import 'lib/client/styles/DocumentForm.less';

interface IProps extends IRouteProps {
  collection: Collection;
}

class DocumentForm extends ViewComponent<IProps, any> {
  public static defaultProps = {
    collection: {},
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      document: _.get(props, 'location.state.document', {}),
      store: api[getGraphQLCollectionType(props.collection)]
    };
  }

  private handlers = _.mapValues({
    updateField: _.curry((field: Field, value: string & React.FormEvent<any>) => {
      if (value.currentTarget) {
        // TODO: transform TextInput onChange cb to pass a value instead of event
        value = value.currentTarget.value;
      }

      const safeGraphQLValue = value === '' ? null : value;
      const newValue = (
        field.type === 'NUMBER' && !_.isNull(safeGraphQLValue)
          ? parseInt(safeGraphQLValue, 10)
          : safeGraphQLValue
      );

      const valueAsArray = _(newValue || '')
        .split('; ')
        .compact();

      this.setStateByPath(
        `document.${_.camelCase(field.name)}`,
        field.isArray ? valueAsArray.value() : newValue
      );
    }),
    clearField: (field: Field) => () => {
      this.setStateByPath(
        `document.${_.camelCase(field.name)}`,
        undefined
      );
    },
    submitForm(event: React.FormEvent<any>) {
      const { collection, history }: Partial<IProps> = this.props;
      const { document: _document, store } = this.state;
      const upsertCollection = `upsert_${collection._collection}`;
      event.preventDefault();

      this.props[upsertCollection](_document)
        .then((response: any) => response.data[upsertCollection])
        .then(store.updateDocument)
        .then(() => history.push(collection.path));
    }
  }, (handler: Function) => handler.bind(this));

  private getField(field: Field) {
    const documentValue: any = this.state.document[_.camelCase(field.name)];

    // TODO: support more input types, eg textarea, date/time picker, ...
    const Input = field.type === 'STRING' ? TextInput : NumericInput;

    // TODO: separate form inputs per value
    const inputValue: any = field.isArray ? (documentValue || []).join('; ') : documentValue;

    return (
      <FlexColumn className="document-field" key={field.name}>
        <label className="pt-label pt-inline">
          <strong className="field-name">
            {field.name}
          </strong>
          <Input
            value={inputValue}
            onChange={this.handlers.updateField(field)}
          />
        {field.type === 'NUMBER' && (
          <Button
            icon="cross"
            color="default"
            size="small"
            minimal={true}
            onClick={this.handlers.clearField(field)}
          />
        )}
        </label>
      </FlexColumn>
    );
  }

  public render() {
    const {
      getField,
      props: { collection },
      handlers: { submitForm }
    } = this;

    return (
      <ViewComponent>
        <div className="form-popover pt-card pt-elevation-3">
          <form name="document-form" onSubmit={submitForm}>
            <div className="header">
              <FlexRow>
                <h3>Document Form</h3>
              </FlexRow>
            </div>
            <div className="form-main">
              <div className="fields">
                {_.map(collection.fields, getField.bind(this))}
              </div>
            </div>
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

export default DocumentForm;
