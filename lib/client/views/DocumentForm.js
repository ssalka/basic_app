import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import { ViewComponent, FlexRow, FlexColumn, Button, TextInput, NumericInput } from '../components';
import 'lib/client/styles/DocumentForm.less';

class DocumentForm extends ViewComponent {
  static defaultProps = {
    collection: {},
    location: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      document: _.get(props, 'location.state.document', {})
    };
  }

  handlers = _.mapValues({
    updateField(field, value) {
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
        `document[${_.camelCase(field.name)}]`,
        field.isArray ? valueAsArray.value() : newValue
      );
    },
    submitForm(event) {
      event.preventDefault();
      const upsertCollection = `upsert_${this.props.collection._collection}`;
      this.props[upsertCollection](this.state.document).then(
        // TODO: update store
        newDocument => console.log('got response', newDocument)
      );
    }
  }, handler => handler.bind(this));

  getField(field) {
    const documentValue = this.state.document[_.camelCase(field.name)];

    // TODO: support more input types, eg textarea, date/time picker, ...
    const Input = field.type === 'STRING' ? TextInput : NumericInput;

    // TODO: separate form inputs per value
    const inputValue = field.isArray ? documentValue.join('; ') : documentValue;

    return (
      <FlexColumn className="document-field" key={field.name}>
        <label class="pt-label pt-inline">
          <strong className="field-name">
            {field.name}
          </strong>
          <Input
            value={inputValue}
            onChange={event => this.handlers.updateField(
              field, event.currentTarget.value
            )}
          />
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