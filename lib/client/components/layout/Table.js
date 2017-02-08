import { NonIdealState } from '@blueprintjs/core';
import FilterableTable from 'react-filterable-table';
import { ViewComponent, Button } from '../';
import '../../styles/Table.less';

class Table extends ViewComponent {
  static defaultProps = {
    headers: [],
    content: [],
    tableProps: {
      tableClassName: 'table pt-table pt-interactive',
      initialSort: 'createdAt'
    }
  };

  getField = header => ({
    name: _.kebabCase(header),
    displayName: header,
    sortable: true,
    inputFilterable: true
  });

  get components() {
    const { headers, content, tableProps } = this.props;
    const initialSortField = { name: tableProps.initialSort, visible: false };
    const fields = headers.map(this.getField).concat(initialSortField);

    return {
      Table: () => (
        <FilterableTable {...tableProps}
          tableClassName="pt-table pt-interactive"
          data={content}
          fields={fields}
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
      components: { Table, Placeholder },
      props: { className, interactive, content }
    } = this;

    return (
      <div className="view">
        {content.length ? <Table /> : <Placeholder />}
      </div>
    );
  }
};

module.exports = Table;
