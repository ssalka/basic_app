import { NonIdealState } from '@blueprintjs/core';
import Griddle from 'griddle-react';
import { ViewComponent, Button } from './';
import '../styles/Table.less';

class Table extends ViewComponent {
  static defaultProps = {
    showHeaders: true,
    headers: [],
    content: [],
    interactive: true
  };

  render() {
    const { className, interactive, showHeaders, headers, content } = this.props;

    return content.length ? (
      <Griddle columns={headers.map(_.kebabCase)}
        results={content} tableClassName="table"
        useGriddleStyles={false}
        showFilter={false}
        showSettings={true}
      />
    ) : (
      <NonIdealState
        visual="table"
        title="This table has no content"
        description={<span>*Empty table description*</span>}
        action={(
          <Button icon="add"
            text="Add a Record"
            color="primary"
            minimal={true}
            rounded={true}
          />
        )}
      />
    );
  }
};

module.exports = Table;
