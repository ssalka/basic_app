import { NonIdealState } from '@blueprintjs/core';
import Griddle from 'griddle-react';
import { ViewComponent, Button } from './';
import '../styles/Table.less';

class Table extends ViewComponent {
  static defaultProps = {
    showHeaders: true,
    headers: [],
    content: [],
    interactive: true,
    griddleProps: {
      useGriddleStyles: false,
      showFiter: false,
      showSettings: false,
      tableClassName: "table pt-table",
      enableInfiniteScroll: true
    }
  };

  get components() {
    const { griddleProps, headers, content } = this.props;

    return {
      GriddleTable: () => (
        <Griddle {...griddleProps}
          columns={headers.map(_.kebabCase)}
          results={content}
          bodyHeight={550}
        />
      ),
      Placeholder: () => {
        return (
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
    }
  }

  render() {
    const {
      components: { GriddleTable, Placeholder },
      props: { className, interactive, showHeaders, content }
    } = this;

    return (
      <div className="view">
        {content.length ? <GriddleTable /> : <Placeholder />}
      </div>
    );
  }
};

module.exports = Table;
