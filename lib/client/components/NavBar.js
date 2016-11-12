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
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/app" className="navbar-brand">
              AppName
            </Link>
          </div>

          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/logout">
                  <Icon name="user" size={14}></Icon>
                  &nbsp;&nbsp;
                  {_.get(this.state, 'user.username', 'Log Out')}
                </Link>
              </li>
            </ul>

            <div className="navbar-form navbar-right">
              <div className="form-group">
                <input type="text" placeholder="Search"
                  className="form-control input-sm"
                />
              </div>
              <button className="btn btn-sm btn-default">
                Submit
              </button>
            </div>
          </div>

        </div>
      </nav>
    );
  }
}

module.exports = NavBar;
