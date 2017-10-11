import * as React from 'react';
import Link from 'react-router-redux-dom-link';
import { BaseComponent, Icon } from '../';
import { ILink, ReactElement } from 'lib/common/interfaces';
import '../../styles/SideBar.less';

interface IProps {
  currentPath: string;
  links: ILink[];
}

interface IState {
  expanded: boolean;
  isDoubleClick: boolean;
}

export default class SideBar extends BaseComponent<IProps, IState> {
  static defaultProps: IProps = {
    currentPath: '',
    links: []
  };

  state: IState = {
    expanded: false,
    isDoubleClick: false
  };

  toggle = () => this._toggle('expanded');

  handleClick(event: React.MouseEvent<HTMLElement>) {
    // only run function on double clicks
    if (!this.state.isDoubleClick) {
      this.state.isDoubleClick = true;
      setTimeout(() => (this.state.isDoubleClick = false), 500);

      return;
    }

    this.toggle();
  }

  renderLink(link, key): ReactElement {
    const linkIsActive = link.path.includes(this.props.currentPath)
      ? 'active'
      : null;

    return (
      <li key={key} className={linkIsActive}>
        <Link to={link.path} className="pt-menu-item">
          <Icon name={link.icon} />
          <span className="text">{link.name}</span>
        </Link>
      </li>
    );
  }

  render() {
    const sidebarClasses: string[] = ['sidebar', 'pt-elevation-1'];
    if (this.state.expanded) {
      sidebarClasses.push('expanded');
    }

    const className: string = sidebarClasses.join(' ');
    const toggleIcon: string =
      'caret-' + (this.state.expanded ? 'left' : 'right');
    const stopPropagation = (e: React.MouseEvent<HTMLUListElement>) =>
      e.stopPropagation();

    return (
      <aside className={className} onClick={this.handleClick}>
        <ul className="pt-menu pt-large" onClick={stopPropagation}>
          {this.props.links.map(this.renderLink)}
        </ul>
        <div id="sidebar-expand">
          <Icon name={toggleIcon} size={14} onClick={this.toggle} />
        </div>
      </aside>
    );
  }
}
