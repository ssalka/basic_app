declare const React;

import { Link } from 'react-router';
import { BaseComponent, Icon } from '../';
import { IView } from 'lib/client/interfaces';
import '../../styles/SideBar.less';

interface IProps {
  currentPath: string;
  links: IView[];
}

export default class SideBar extends BaseComponent<IProps, any> {
  public static defaultProps: IProps = {
    currentPath: '',
    links: []
  };

  public state = {
    expanded: false,
    isDoubleClick: false
  };

  private toggle() {
    this._toggle('expanded');
  }

  private handleClick(event) {
    // only run function on double clicks
    if (!this.state.isDoubleClick) {
      this.state.isDoubleClick = true;
      setTimeout(() => this.state.isDoubleClick = false, 500);

      return;
    }

    this.toggle();
  }

  private renderLink(link, key) {
    const linkIsActive = link.path.includes(this.props.currentPath) ? 'active' : null;

    return (
      <li key={key} className={linkIsActive}>
        <Link to={link.path} className="pt-menu-item">
          <Icon name={link.icon} />
          <span className="text">
            {link.name}
          </span>
        </Link>
      </li>
    );
  }

  public render() {
    let sidebarClasses: string[] = ['sidebar', 'pt-elevation-1'];
    if (this.state.expanded) {
      sidebarClasses.push('expanded');
    }

    const className: string = sidebarClasses.join(' ');
    const toggleIcon: string = 'caret-' + (this.state.expanded ? 'left' : 'right');
    const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();

    return (
      <aside className={className} onClick={this.handleClick}>
        <ul className="pt-menu pt-large" onClick={stopPropagation}>
          {this.props.links.map(this.renderLink)}
        </ul>
        <div id="sidebar-expand">
          <Icon
            name={toggleIcon}
            size={14}
            onClick={this.toggle}
          />
        </div>
      </aside>
    );
  }
}
