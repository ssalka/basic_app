import _ from 'lodash';
import React from 'react';
import { ViewComponent, Button } from './';
import { NonIdealState } from '@blueprintjs/core';
import '../styles/Table.less';

class Table extends ViewComponent {
  static defaultProps = {
    showHeaders: true,
    headers: [],
    content: [],
    interactive: true
  };

  renderRow(entry) {
    if (_.isArray(entry)) {
      return entry.map(field => <td>{field}</td>);
    }
    if (_.isObject(entry)) {
      // Headers indicate render order for documents
      const { headers } = this.props;
      if (!headers) throw new Error(
        'The `headers` attribute is required when using documents for rows'
      );

      return headers.map(field => <td>{entry[_.camelCase(field)]}</td>);
    }

    return null;
  }

  render() {
    const { className, interactive, showHeaders, headers, content } = this.props;

    if (!content.length) return (
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

    const tableClassName = `${className} table pt-table ${interactive ? 'pt-interactive' : ''}`.trim();

    const Headers = headers.map(header => (
      <th>{header}</th>
    ));

    const Rows = content.map(entry => (
      <tr>{this.renderRow(entry)}</tr>
    ));

    return (
      <table className={tableClassName}>
        {showHeaders && headers.length ? (
          <thead><tr>{ Headers }</tr></thead>
        ) : null}
        <tbody>{ Rows }</tbody>
      </table>
    );
  }
};

module.exports = Table;
