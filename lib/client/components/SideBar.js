import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';

import { BaseComponent, Icon } from './';
import '../styles/SideBar.less';

class SideBar extends BaseComponent {
  state = {
    expanded: false
  };

  static defaultProps = {
    currentPath: '',
    links: []
  };

  toggle() {
    this._toggle('expanded');
  }

  handleClick(event) {
    // only run function on double clicks
    if (!this.isDoubleClick) {
      this.isDoubleClick = true;
      setTimeout(() => this.isDoubleClick = false, 500);
      return;
    }

    this.toggle();
  }

  renderLink(link, key) {
    const linkIsActive = link.path.includes(this.props.currentPath) ? 'active' : null;
    return (
      <li key={key} className={linkIsActive}>
        <Link to={!key ? link.path : `/collections${link.path}`} className="pt-menu-item">
          <Icon name={link.icon} />
          <span className="text">
            {link.name}
          </span>
        </Link>
      </li>
    );
  }

  render() {
    let sidebarClasses = ['sidebar', 'pt-elevation-1'];
    if (this.state.expanded) sidebarClasses.push('expanded');
    sidebarClasses = sidebarClasses.join(' ');

    const toggleIcon = 'caret-' + (this.state.expanded ? 'left' : 'right');

    return (
      <aside className={sidebarClasses} onClick={this.handleClick}>
        <ul className="pt-menu pt-large" onClick={e => e.stopPropagation()}>
          {this.props.links.map(this.renderLink)}
        </ul>
        <div id="sidebar-expand">
          <Icon name={toggleIcon} size={14}
            onClick={this.toggle}
          />
        </div>
      </aside>
    );
  }
}

module.exports = SideBar;
