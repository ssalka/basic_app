declare const _;
declare const React;
import { Tree, ITreeNode } from '@blueprintjs/core';
import { connect, CollectionStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';
import { Collection } from 'lib/client/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import 'lib/client/styles/TypeSelect.less';

interface IProps {
  selectedType: string;
  onSelectType(id: string | number): void;
}

interface IState {
  collections?: Collection[];
  nodes: ITreeNode[];
}

@connect(CollectionStore)
class TypeSelect extends ViewComponent<IProps, IState> {
  public state: IState = {
    collections: [],
    nodes: [{
      id: 'category-standard',
      hasCaret: true,
      label: 'Standard Types',
    isExpanded: true
    }, {
      id: 'category-collections',
      hasCaret: true,
      label: 'Collections',
      isExpanded: false
    }]
  };

  constructor(props: IProps) {
    super(props);

    this.state.nodes[0].childNodes = FIELD_TYPES.STANDARD.map(
      ({ key, name, icon }): ITreeNode => ({
        id: key,
        iconName: icon,
        label: name,
        isSelected: key === props.selectedType
      })
    );
  }

  private getNodes(collections: Collection[], selectedType: string): ITreeNode[] {
    const childNodes: ITreeNode[] = collections.map(
      ({ _collection, name, icon }) => ({
        id: _collection,
        iconName: icon,
        label: name,
        isSelected: _collection === selectedType
      })
    );

    const nodes = this.state.nodes.slice();
    _.assign(nodes[1], { childNodes });

    return nodes;
  }

  private handleNodeClick(nodeData: ITreeNode) {
    if (_.includes(nodeData.id, 'category')) {
      this.toggleNode(nodeData);
    }
    else {
      this.props.onSelectType(nodeData.id);

      _(this.state.nodes)
        .flatMap('childNodes')
        .compact()
        .forEach((node: ITreeNode): ITreeNode => _.assign(node, {
          isSelected: !nodeData.isSelected && node.id === nodeData.id
        }));
    }

    this.setState(this.state);
  }

  private toggleNode(nodeData: ITreeNode) {
    const index: number = _.findIndex(this.state.nodes, _.pick(nodeData, 'id'));
    const nodes: ITreeNode[] = this.state.nodes.slice();
    nodes[index].isExpanded = !nodes[index].isExpanded;
    this.setState({ nodes });
  }

  public render() {
    const typeCategories: ITreeNode[] = this.getNodes(this.state.collections, this.props.selectedType);

    return (
      <div className="type-select">
        <Tree
          contents={typeCategories}
          onNodeClick={this.handleNodeClick}
          onNodeCollapse={this.toggleNode}
          onNodeExpand={this.toggleNode}
        />
      </div>
    );
  }
}

export default TypeSelect;
