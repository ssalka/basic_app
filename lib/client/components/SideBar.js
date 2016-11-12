import { Link } from 'react-router';

import { BaseComponent, Icon } from './';
import '../styles/SideBar.less';

class SideBar extends BaseComponent {
  state = {
    expanded: false,
    showLabels: true
  }

  renderLink(link, key) {
    const classes = ['list-group-item'];
    if (location.pathname.includes(link.path)) classes.push('active');

    return (
      <Link to={link.path} className={classes.join(' ')} key={key}>
        {this.state.expanded ? (
          <div>
            <Icon name={link.icon} size={14} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            {link.name}
          </div>
        ) : (
          <div className="icon-container">
            <Icon name={link.icon} />
            {this.state.showLabels ? <h6>{link.name}</h6> : null}
          </div>
        )}
      </Link>
    );
  }

  render() {
    const classes = ['sidebar'];
    if (this.state.expanded) classes.push('expanded');

    return (
      <aside className={classes.join(' ')}>
        <div className="list-group">
          {this.props.links.map(this.renderLink)}
        </div>
        <div id="sidebar-expand">
          <Icon name="expand" size={14}
            onClick={() => this.toggle('expanded')}
          />
        </div>
      </aside>
    );
  }
}

module.exports = SideBar;
