import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import { InputGroup } from '@blueprintjs/core';

import { User } from '../api';
import { UserStore } from '../api/stores';
import { BaseComponent, Button, Icon } from './';
import '../styles/Navbar.less';

const connect = createConnector(React);

@connect(UserStore)
class NavBar extends BaseComponent {
  render() {
    const { user } = this.state;
    const crossIcon = <Button minimal={true} icon="cross" />;

    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to={user ? '/home' : '/'} className="pt-navbar-heading">
            AppName
          </Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          {user ? (
            <InputGroup placeholder="Search"
              className="pt-inputs pt-round"
              leftIconName="search"
              rightElement={crossIcon}
            />
          ) : null}
          <Link to={user ? '/logout' : '/login'}>
            <Button text={user ? null : 'Sign In'}
              icon="user"
              minimal={true}
              rounded={true}
            />
          </Link>
        </div>
      </nav>
    );
  }
}

module.exports = NavBar;
