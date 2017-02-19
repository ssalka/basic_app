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

  handlers = {
    submitForm(event) {
      event.preventDefault();
      console.log('Submitting form with', this.props.document);
    }
  };

  getField(field) {
    const documentValue = this.state.document[_.camelCase(field.name)];

    // TODO: support more input types, eg textarea, date/time picker, ...
    const Input = field.type === 'STRING' ? TextInput : NumericInput;

    // TODO: separate form inputs per value
    const inputValue = field.isArray ? documentValue.join('; ') : documentValue;

    return (
      <FlexColumn className="document-field" key={field.name}>
        <label class="pt-label pt-inline">
          <div className="field-name">
            <strong>{field.name}</strong>
          </div>
          <Input
            value={inputValue}
            onChange={event => console.log(event)}
          />
        </label>
      </FlexColumn>
    );
  }

  render() {
    const { submitForm } = this.handlers;

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
                {_.map(this.props.collection.fields, this.getField)}
              </div>
            </div>
            <FlexRow className="fill-width">
              <Button text="Save" type="submit" size="large" color="success" onClick={submitForm.bind(this)} />
              <Button text="Cancel" size="large" color="danger" onClick={browserHistory.goBack} />
            </FlexRow>
          </form>
        </div>
      </ViewComponent>
    );
  }
}

module.exports = DocumentForm;
