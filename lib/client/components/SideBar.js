import { Link } from 'react-router';

import { BaseComponent, Icon } from './';
import '../styles/SideBar.less';

class SideBar extends BaseComponent {
  state = {
    expanded: false
  }

  renderLink(link, key) {
    const linkIsActive = location.pathname.includes(link.path) ? 'active' : null;
    return (
      <li key={key} className={linkIsActive}>
        <Link to={link.path} className="pt-menu-item" tabIndex="0">
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
      <aside className={sidebarClasses}>
        <ul className="pt-menu pt-large">
          {this.props.links.map(this.renderLink)}
        </ul>
        <div id="sidebar-expand">
          <Icon name={toggleIcon} size={14}
            onClick={() => this.toggle('expanded')}
          />
        </div>
      </aside>
    );
  }
}

module.exports = SideBar;
