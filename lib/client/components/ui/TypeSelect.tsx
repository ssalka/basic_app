declare const _;
declare const React;
import { Tree, ITreeNode } from '@blueprintjs/core';
import { ViewComponent } from 'lib/client/components';
import { Collection, IType } from 'lib/client/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import 'lib/client/styles/TypeSelect.less';

export interface IProps {
  collections?: Collection[];
  selectedType: string;
  onSelectType(id: string | number): void;
}

export interface IState {
  nodes: ITreeNode[];
}

export default class TypeSelect extends ViewComponent<IProps, IState> {
  state: IState = {
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
      typeToTreeNode(props.selectedType)
    );
  }

  getNodes(collections: Collection[], selectedType: string): ITreeNode[] {
    const childNodes: ITreeNode[] = collections.map(collectionToTreeNode(selectedType));
    const nodes = this.state.nodes.slice();
    _.assign(nodes[1], { childNodes });

    return nodes;
  }

  handleNodeClick(nodeData: ITreeNode) {
    if (_.includes(nodeData.id, 'category')) {
      return this.toggleNode(nodeData);
    }

    this.props.onSelectType(nodeData.id);

    const nodes: ITreeNode[] = this.state.nodes.map(({ childNodes, ...node }) => ({
      ...node,
      childNodes: childNodes.map(childNode => ({
        ...childNode,
        isSelected: !nodeData.isSelected && childNode.id === nodeData.id
      }))
    }));

    this.setState({ nodes });
  }

  toggleNode({ id }: ITreeNode) {
    const index: number = _.findIndex(this.state.nodes, { id });
    const nodes: ITreeNode[] = this.state.nodes.slice();
    nodes[index].isExpanded = !nodes[index].isExpanded;
    this.setState({ nodes });
  }

  render() {
    const typeCategories: ITreeNode[] = this.getNodes(this.props.collections, this.props.selectedType);

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

export const typeToTreeNode = (selected: string) => (
  ({ key, icon, name }: IType): ITreeNode => ({
    id: key,
    iconName: icon,
    label: name,
    isSelected: key === selected
  })
);

export const collectionToTreeNode = (selected: string) => (
  ({ _collection, icon, name }: Collection): ITreeNode => ({
    id: _collection,
    iconName: icon,
    label: name,
    isSelected: _collection === selected
  })
);
