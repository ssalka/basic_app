declare const _;
declare const React;
import { Tree, ITreeNode } from '@blueprintjs/core';
import { ViewComponent } from 'lib/client/components';
import { FIELD_TYPES } from 'lib/common/constants';
import 'lib/client/styles/TypeSelect.less';

export default class TypeSelect extends ViewComponent<any, any> {
  state = {
    nodes: [{
      id: 'category-standard',
      hasCaret: true,
      label: 'Standard Types',
      isExpanded: true,
      childNodes: FIELD_TYPES.STANDARD.map(({ key, name, icon }): ITreeNode => ({
        id: key,
        iconName: icon,
        label: name
      }))
    }]
  };

  private handleNodeClick(nodeData: ITreeNode) {
    if (_.includes(nodeData.id, 'category')) {
      const toggleMethod = nodeData.isExpanded ? 'handleNodeCollapse' : 'handleNodeExpand';
      this[toggleMethod](nodeData);
    }
    else {
      this.props.onSelectType(nodeData.id);
      nodeData.isSelected = !nodeData.isSelected;
    }

    this.setState(this.state);
  }

  private handleNodeCollapse(nodeData: ITreeNode) {
    nodeData.isExpanded = false;
    this.setState(this.state);
  }

  private handleNodeExpand(nodeData: ITreeNode) {
    nodeData.isExpanded = true;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="type-select">
        <Tree
          contents={this.state.nodes}
          onNodeClick={this.handleNodeClick}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}
        />
      </div>
    );
  }
}
