import { NonIdealState } from '@blueprintjs/core';
import FilterableTable from 'react-filterable-table';
import { ViewComponent, Button } from '../';
import '../../styles/Table.less';

class Table extends ViewComponent {
  static defaultProps = {
    headers: [],
    content: [],
    onSelectDocument: _.noop,
    pathname: '',
    tableProps: {
      tableClassName: 'pt-table pt-interactive',
      initialSort: 'createdAt'
    }
  };

  getField(header, index) {
    const { onSelectDocument } = this.props;
    return ({
      name: _.kebabCase(header),
      displayName: header,
      sortable: true,
      inputFilterable: true,
      render: props => (
        <span onClick={() => onSelectDocument(props.record)}>
          {props.value}
        </span>
      )
    });
  }

  get components() {
    const { headers, content, pathname, tableProps } = this.props;
    const initialSortField = { name: tableProps.initialSort, visible: false };
    const fields = headers.map(this.getField).concat(initialSortField);
    const props = {
      ...tableProps,
      fields,
      pathname,
      data: content
    };

    // Bug in react-filterable-table: tableClassName prop doesn't get set
    // NOTE: project ^ appears to be in its infancy...consider alternatives
    setTimeout(() => {
      const table = document.querySelector('.table');
      tableProps.tableClassName.split(' ').map(x => table.classList.add(x));
    });

    return {
      Table: () => (
        <FilterableTable {...props} />
      ),
      Placeholder: () => (
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
      )
    };
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
