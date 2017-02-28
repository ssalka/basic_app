declare const React;

import { Link } from 'react-router';
import { BaseComponent, Icon } from '../';
import '../../styles/SideBar.less';

export default class SideBar extends BaseComponent<any, any> {
  state = {
    expanded: false,
    isDoubleClick: false,
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
    if (!this.state.isDoubleClick) {
      this.state.isDoubleClick = true;
      setTimeout(() => this.state.isDoubleClick = false, 500);
      return;
    }

    this.toggle();
  }

  renderLink(link, key) {
    const linkIsActive = link.path.includes(this.props.currentPath) ? 'active' : null;
    return (
      <li key={key} className={linkIsActive}>
        <Link to={link.path} className="pt-menu-item">
          <Icon name={link.icon} className={''/*
            className is a required attribute? ._.
          */} />
          <span className="text">
            {link.name}
          </span>
        </Link>
      </li>
    );
  }

  render() {
    let sidebarClasses: string[] = ['sidebar', 'pt-elevation-1'];
    if (this.state.expanded) sidebarClasses.push('expanded');
    const className: string = sidebarClasses.join(' ');

    const toggleIcon: string = 'caret-' + (this.state.expanded ? 'left' : 'right');

    return (
      <aside className={className} onClick={this.handleClick}>
        <ul className="pt-menu pt-large" onClick={e => e.stopPropagation()}>
          {this.props.links.map(this.renderLink)}
        </ul>
        <div id="sidebar-expand">
          <Icon name={toggleIcon} size={14}
            onClick={this.toggle} className
          />
        </div>
      </aside>
    );
  }
}
