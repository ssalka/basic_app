import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import api from '../api';
import { UserStore } from '../api/stores';
import '../styles/Navbar.less';

const BaseComponent = require('./BaseComponent');
const { request } = require('lib/common');
const { User } = api;
const connect = createConnector(React);

@connect(UserStore)
class NavBar extends BaseComponent {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/app" className="navbar-brand">AppName</Link>
          </div>

          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/logout">
                  <span className="glyphicon glyphicon-user"></span> 
                  { _.get(this.state, 'user.username', 'Log Out') }
                </Link>
              </li>
            </ul>
            <div className="navbar-form navbar-right">
              <div className="form-group">
                <input type="text" className="form-control input-sm" placeholder="Search" />
              </div>
              <button className="btn btn-sm btn-default">Submit</button>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

module.exports = NavBar;
