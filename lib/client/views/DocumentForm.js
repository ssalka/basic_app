import { EditableText } from '@blueprintjs/core';
import { browserHistory } from 'react-router';
import { ViewComponent, FlexRow, FlexColumn, Button } from '../components';
import 'lib/client/styles/DocumentForm.less';

class DocumentForm extends ViewComponent {
  static defaultProps = {
    collection: {},
    document: {},
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

  getField(value, field) {
    return (
      <FlexColumn className="document-field" key={field}>
        <label class="pt-label pt-inline">
          <div className="field-name">
            <strong>{field}</strong>
          </div>
          <EditableText value={value} onChange={val => console.log(val)} />
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
                {_(this.state.document)
                  .omit(['__typename', '_id'])
                  .mapKeys((val, key) => _.startCase(key))
                  .map(this.getField)
                  .value()}
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
