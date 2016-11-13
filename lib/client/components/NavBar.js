import { Link } from 'react-router';
import { createConnector } from 'cartiv';

import { User } from '../api';
import { UserStore } from '../api/stores';
import { BaseComponent, Icon } from './';
import '../styles/Navbar.less';

const connect = createConnector(React);

@connect(UserStore)
class NavBar extends BaseComponent {
  render() {
    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to="/app" className="pt-navbar-heading">
            AppName
          </Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <input className="pt-input" placeholder="Search files..." type="text" />
          <button className="pt-button pt-minimal pt-icon-user"></button>
        </div>
      </nav>
    );
  }
}

module.exports = NavBar;
