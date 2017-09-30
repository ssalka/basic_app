declare const _;
declare const React;
import { NonIdealState, IconName } from '@blueprintjs/core';
import * as FilterableTable from 'react-filterable-table';
import { IDocument, Field, IComponentModule, ReactElement, ReactProps, SFC } from 'lib/client/interfaces';
import { RenderingService } from 'lib/client/services';
import { ViewComponent, Button } from '../';
import '../../styles/Table.less';

interface IProps extends ReactProps {
  fields: Field[];
  records: any[];
  pathname: string;
  tableProps: {
    tableClassName: string;
    initialSort: string;
  };
  onSelectDocument(doc: any): void;
}

export default class Table extends ViewComponent<IProps, any> {
  public static defaultProps: IProps = {
    fields: [],
    records: [],
    onSelectDocument: _.noop,
    pathname: '',
    tableProps: {
      tableClassName: 'pt-table pt-interactive',
      initialSort: 'createdAt'
    }
  };

  private getFieldProps(field: Field): object {
    const { onSelectDocument } = this.props;
    const handleClick: (doc: IDocument) => React.MouseEventHandler<HTMLSpanElement> = (
      (doc: IDocument) => () => onSelectDocument(doc)
    );

    // TODO: optimize performance
    const Component: SFC = ({ record }) => (
      RenderingService.renderField(record, field, {
        onClick: handleClick(record)
      })
    );

    return {
      name: _.kebabCase(field.name),
      displayName: field.name,
      sortable: true,
      inputFilterable: true,
      render: (props: any) => (
        <Component {...props} />
      )
    };
  }

  private get components(): IComponentModule {
    const { fields, records, pathname, tableProps: _tableProps } = this.props;
    const initialSortField: object = { name: _tableProps.initialSort, visible: false };
    const fieldProps: object[] = fields.map(this.getFieldProps).concat(initialSortField);
    const tableProps = {
      ..._tableProps,
      fields: fieldProps,
      pathname,
      data: records
    };

    // Bug in react-filterable-table: tableClassName prop doesn't get set
    // NOTE: project ^ appears to be in its infancy...consider alternatives
    setTimeout(() => {
      const table: Element = document.querySelector('.table');
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
          visual={"table" as IconName}
          title="This table has no records"
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
    const View: SFC = this.props.records.length ? Table : Placeholder;

    return (
      <div className="view">
        <View />
      </div>
    );
  }
};
