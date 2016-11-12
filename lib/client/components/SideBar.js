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
        {this.state.expanded ? link.name : (
          <div className="icon-container">
            <Icon name={link.icon}></Icon>
            {this.state.showLabels ? <h6>{link.name}</h6> : null}
          </div>
        )}
      </Link>
    );
  }

  render() {
    return (
      <div className="sidebar">
        <div className="list-group">
          {this.props.links.map(this.renderLink)}
        </div>
      </div>
    );
  }
}

module.exports = SideBar;
