import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import api from 'lib/client/api';
import { ViewComponent, FlexRow, FlexColumn, Button, TextInput, NumericInput } from 'lib/client/components';
import { getGraphQLCollectionType } from 'lib/common/graphql';
import 'lib/client/styles/DocumentForm.less';

class DocumentForm extends ViewComponent {
  static defaultProps = {
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

  handlers = _.mapValues({
    updateField: _.curry((field, value) => {
      if (value.currentTarget) {
        // TODO: transform TextInput onChange cb to pass a value instead of event
        value = value.currentTarget.value;
      }

      const safeGraphQLValue = value === '' ? null : value;
      const newValue = (
        field.type === 'NUMBER' && !_.isNull(safeGraphQLValue)
          ? parseInt(safeGraphQLValue)
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
    clearField: field => () => {
      this.setStateByPath(
        `document.${_.camelCase(field.name)}`,
        undefined
      );
    },
    submitForm(event) {
      const { collection, history } = this.props;
      const { document: _document, store } = this.state;
      const upsertCollection = `upsert_${collection._collection}`;
      event.preventDefault();

      this.props[upsertCollection](_document)
        .then(response => response.data[upsertCollection])
        .then(store.updateDocument)
        .then(() => history.push(collection.path));
    }
  }, handler => handler.bind(this));

  getField(field) {
    const documentValue = this.state.document[_.camelCase(field.name)];

    // TODO: support more input types, eg textarea, date/time picker, ...
    const Input = field.type === 'STRING' ? TextInput : NumericInput;

    // TODO: separate form inputs per value
    const inputValue = field.isArray ? (documentValue || []).join('; ') : documentValue;

    return (
      <FlexColumn className="document-field" key={field.name}>
        <label class="pt-label pt-inline">
          <strong className="field-name">
            {field.name}
          </strong>
          <Input
            value={inputValue}
            onChange={this.handlers.updateField(field)}
          />
        {field.type === 'NUMBER' && (
          <Button icon="cross"
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

  render() {
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

module.exports = DocumentForm;
