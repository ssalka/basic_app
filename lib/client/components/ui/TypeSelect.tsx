import * as _ from 'lodash';
import * as React from 'react';
import { Tree, ITreeNode as TreeNode, IconName } from '@blueprintjs/core';
import { ViewComponent } from 'lib/client/components';
import { Collection, Field, IType } from 'lib/common/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import 'lib/client/styles/TypeSelect.less';

export interface IProps {
  collections?: Collection[];
  selectedType: IType | Collection;
  onSelectType(udpatedTypeInfo: Partial<Field>): void;
}

interface ITreeNode extends TreeNode {
  id: string;
}

export interface IState {
  nodes: ITreeNode[];
}

export default class TypeSelect extends ViewComponent<IProps, IState> {
  state: IState = {
    nodes: [
      {
        id: 'category-standard',
        hasCaret: true,
        label: 'Standard Types',
        isExpanded: true
      },
      {
        id: 'category-collections',
        hasCaret: true,
        label: 'Collections',
        isExpanded: false
      }
    ]
  };

  constructor(props: IProps) {
    super(props);

    this.state.nodes[0].childNodes = FIELD_TYPES.STANDARD.map(
      typeToTreeNode(props.selectedType as IType)
    );
  }

  getNodes(collections: Collection[], selectedType: IType | Collection): ITreeNode[] {
    const childNodes: ITreeNode[] = collections.map(
      collectionToTreeNode(selectedType as Collection)
    );
    const nodes = this.state.nodes.slice();
    _.assign(nodes[1], { childNodes });

    return nodes;
  }

  handleNodeClick(nodeData: ITreeNode) {
    if (nodeData.id.includes('category')) {
      return this.toggleNode(nodeData);
    }

    const typeCategory = _.map(this.state.nodes[0].childNodes, 'id').includes(nodeData.id)
      ? 'type'
      : '_collection';

    const updatedTypeInfo: Partial<Field> =
      typeCategory === 'type'
        ? { type: nodeData.id as string, _collection: undefined }
        : { type: FIELD_TYPES.COLLECTION, _collection: nodeData.id as string };

    const nodes: ITreeNode[] = this.state.nodes.map(({ childNodes, ...node }) => ({
      ...node,
      childNodes: childNodes.map(childNode => ({
        ...childNode,
        isSelected: !nodeData.isSelected && childNode.id === nodeData.id
      }))
    }));

    this.props.onSelectType(updatedTypeInfo);

    this.setState({ nodes });
  }

  toggleNode({ id }: ITreeNode) {
    const index: number = _.findIndex(this.state.nodes, { id });
    const nodes: ITreeNode[] = this.state.nodes.slice();
    nodes[index].isExpanded = !nodes[index].isExpanded;
    this.setState({ nodes });
  }

  render() {
    const typeCategories: ITreeNode[] = this.getNodes(
      this.props.collections,
      this.props.selectedType
    );

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

export const typeToTreeNode = (selectedType: IType) => ({
  key,
  icon,
  name
}: IType): ITreeNode => ({
  id: key,
  iconName: icon as IconName,
  label: name,
  isSelected: key === selectedType.key
});

export const collectionToTreeNode = (selectedCollection: Collection) => ({
  _id,
  icon,
  name
}: Collection): ITreeNode => ({
  id: _id,
  iconName: icon as IconName,
  label: name,
  isSelected: _id === selectedCollection._id
});
