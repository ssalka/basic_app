import { ViewComponent, FlexRow } from '../components';

class DocumentForm extends ViewComponent {
  static defaultProps = {
    document: { _id: null }
  };

  handlers = {
    submitForm(event) {
      event.preventDefault();
      console.log('Submitting form with', this.props.document);
    }
  };

  render() {
    const {
      props: { document },
      handlers: { submitForm }
    } = this;

    return (
      <ViewComponent>
        <div id="document-form" className="pt-card pt-elevation-3">
          <form name="document-form" onSubmit={submitForm}>
            <div className="header">
              <FlexRow>
                Document Form - editing document {document._id}
              </FlexRow>
            </div>
          </form>
        </div>
      </ViewComponent>
    );
  }
}

module.exports = DocumentForm;
