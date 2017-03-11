declare const _;
declare const React;
import { Tree, ITreeNode } from '@blueprintjs/core';
import { ViewComponent } from 'lib/client/components';
import { FIELD_TYPES } from 'lib/common/constants';
import 'lib/client/styles/TypeSelect.less';

interface State {
  nodes: ITreeNode[];
}

export default class TypeSelect extends ViewComponent<any, any> {
  state: State = {
    nodes: [{
      id: 'category-standard',
      hasCaret: true,
      label: 'Standard Types',
      isExpanded: true
    }]
  };

  constructor(props) {
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

  private handleNodeClick(nodeData: ITreeNode) {
    if (_.includes(nodeData.id, 'category')) {
      const toggleMethod = nodeData.isExpanded ? 'handleNodeCollapse' : 'handleNodeExpand';
      this[toggleMethod](nodeData);
    }
    else {
      this.props.onSelectType(nodeData.id);
      _.forEach(this.state.nodes[0].childNodes, node => _.assign(node, {
        isSelected: node.id === nodeData.id && !nodeData.isSelected
      }));
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
