declare const _;
declare const React;
import { NonIdealState } from '@blueprintjs/core';
import * as FilterableTable from 'react-filterable-table';
import { IComponentModule, ReactElement } from 'lib/client/interfaces';
import { ViewComponent, Button } from '../';
import '../../styles/Table.less';

interface IProps extends React.Props<any> {
  headers: string[];
  content: any[];
  onSelectDocument: Function;
  pathname: string;
  tableProps: {
    tableClassName: string;
    initialSort: string;
  };
}

export default class Table extends ViewComponent<IProps, any> {
  public static defaultProps: IProps = {
    headers: [],
    content: [],
    onSelectDocument: _.noop,
    pathname: '',
    tableProps: {
      tableClassName: 'pt-table pt-interactive',
      initialSort: 'createdAt'
    }
  };

  private getField(header: string, index: number): {} {
    const { onSelectDocument } = this.props;
    const handleClick: (doc: any) => React.MouseEventHandler<HTMLSpanElement> = (
      (doc: any) => () => onSelectDocument(doc)
    );

    return {
      name: _.kebabCase(header),
      displayName: header,
      sortable: true,
      inputFilterable: true,
      render: (props: any) => (
        <span onClick={handleClick(props.record)}>
          {props.value}
        </span>
      )
    };
  }

  private get components(): IComponentModule {
    const { headers, content, pathname, tableProps: _tableProps } = this.props;
    const initialSortField = { name: _tableProps.initialSort, visible: false };
    const fields = headers.map(this.getField).concat(initialSortField as any);
    const tableProps = {
      ..._tableProps,
      fields,
      pathname,
      data: content
    };

    // Bug in react-filterable-table: tableClassName prop doesn't get set
    // NOTE: project ^ appears to be in its infancy...consider alternatives
    setTimeout(() => {
      const table = document.querySelector('.table');
      tableProps.tableClassName.split(' ').map(
        (className: string) => table.classList.add(className)
      );
    });

    return {
      Table: () => (
        <FilterableTable {...tableProps} />
      ),
      Placeholder: () => (
        <NonIdealState
          visual="table"
          title="This table has no content"
          description={<span>*Empty table description*</span>}
          action={(
            <Button
              icon="add"
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

  public render() {
    const { Table, Placeholder }: IComponentModule = this.components;
    const View: any = this.props.content.length ? Table : Placeholder;

    return (
      <div className="view">
        <View />
      </div>
    );
  }
};
