declare const _;
declare const React;
import { Classes, MenuItem } from '@blueprintjs/core';
import { ReactSelectProps } from 'react-select';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import { IDocument, Collection } from 'lib/client/interfaces';
import ViewComponent from '../ViewComponent';
import styled from 'styled-components';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

interface ICollectionSelectProps extends ReactSelectProps {
  documents: IDocument | IDocument[];
  value?: IDocument | IDocument[];
  onChange?(newFieldValue: IDocument | IDocument[]): void;
  labelKey: string;
}

export default class CollectionSelect extends ViewComponent<ICollectionSelectProps> {
  static defaultProps = {
    documents: [],
    value: []
  };

  handleChange(newFieldValue: IDocument | IDocument[]) {
    this.props.onChange(newFieldValue);
  }

  render() {
    const {
      documents,
      ...props
    } = this.props;

    const filterOptions = createFilterOptions({
      valueKey: this.props.labelKey
    });

    return (
      <MultiSelectContainer>
        <Select
          {...props}
          autofocus={true}
          filterOptions={filterOptions}
          options={documents}
        />
      </MultiSelectContainer>
    );
  }
}

const MultiSelectContainer = styled.div`
  display: inline-block;
  .Select {
    min-width: 200px;
  }
`;
