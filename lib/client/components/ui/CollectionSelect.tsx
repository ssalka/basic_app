declare const _;
declare const React;
import { Classes, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/labs';
import { IDocument, Collection } from 'lib/client/interfaces';
import ViewComponent from '../ViewComponent';
import styled from 'styled-components';

interface ICollectionSelectProps {
  collection: Collection;
  documents: IDocument[];
  onChange?(documents: IDocument[]): void;
}

interface ICollectionSelectState {
  selectedDocuments: IDocument[];
  firstField: string;
}

export default class CollectionSelect extends ViewComponent<ICollectionSelectProps, ICollectionSelectState> {
  static defaultProps = {
    documents: [],
    selectedDocuments: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedDocuments: [],
      firstField: _.camelCase(props.collection.fields[0].name)
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const [currentSelectedDocs, nextSelectedDocs] = _.map([this.state, nextState], 'selectedDocuments');
    if (this.props.onChange && !_.isEqualWith(currentSelectedDocs, nextSelectedDocs, '_id')) {
      this.props.onChange(nextSelectedDocs);
    }
  }

  filterItem = (query: string, doc: IDocument, index: number): boolean => (
    (doc[this.state.firstField] || '').toLowerCase().includes(query.toLowerCase())
  );

  handleTagRemove = (_tag: string, index: number) => {
    this.deselectDocument(this.state.selectedDocuments[index]);
  }

  isDocumentSelected = (doc: IDocument): boolean  => (
    _.map(this.state.selectedDocuments, '_id').includes(doc._id)
  );

  handleSelect = (doc: IDocument) => {
    if (!this.isDocumentSelected(doc)) {
      this.selectDocument(doc);
    }
    else {
      this.deselectDocument(doc);
    }
  }

  selectDocument(doc: IDocument) {
    this.setState({
      selectedDocuments: [...this.state.selectedDocuments, doc]
    });
  }

  deselectDocument(doc: IDocument) {
    this.setState({
      selectedDocuments: this.state.selectedDocuments.filter(
        _doc => _doc._id !== doc._id
      )
    });
  }

  renderTag = (doc: IDocument): string => doc[this.state.firstField] || doc._id;

  render() {
    const { documents } = this.props;
    type CollectionType = typeof documents[0];
    const MultiSelectOfCollection: any = MultiSelect.ofType<CollectionType>();

    return (
      <MultiSelectContainer>
        <MultiSelectOfCollection
          items={documents.slice(0, 1000)}
          itemPredicate={this.filterItem}
          itemRenderer={this.renderItem}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this.handleSelect}
          popoverProps={{ popoverClassName: Classes.MINIMAL }}
          resetOnSelect={true}
          selectedItems={this.state.selectedDocuments}
          tagRenderer={this.renderTag}
          tagInputProps={{
            onRemove: this.handleTagRemove,
            placeholder: '' // BUG: blueprint resets text to "Search..." after selecting an item
          }}
        />
      </MultiSelectContainer>
    );
  }

  renderItem = ({ handleClick, isActive, item }) => (
    <MenuItem
      iconName={this.isDocumentSelected(item) ? "tick" : "blank"}
      key={item._id}
      onClick={handleClick}
      text={this.renderTag(item)}
      shouldDismissPopover={false}
    />
  )
}

const MultiSelectContainer = styled.div`
  display: inline-block;
  max-width: 330px;

  input {
    border: 0;
  }
`;
