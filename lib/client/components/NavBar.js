import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import { InputGroup, Button } from '@blueprintjs/core';

import { User } from '../api';
import { UserStore } from '../api/stores';
import { BaseComponent, Icon } from './';
import '../styles/Navbar.less';

const connect = createConnector(React);

@connect(UserStore)
class NavBar extends BaseComponent {
  render() {
    const crossIcon = <button className="pt-button pt-minimal pt-icon-cross"></button>;

    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to={this.state.user ? '/home' : '/'} className="pt-navbar-heading">
            AppName
          </Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
        {this.state.user ? (
          <InputGroup placeholder="Search"
            className="pt-inputs pt-round"
            leftIconName="search"
            rightElement={crossIcon}
          />
        ) : null}
          <Link to={this.state.user ? '/logout' : '/login'}>
            <Button className="pt-minimal" iconName="user" text={this.state.user ? null : 'Sign In'}></Button>
          </Link>
        </div>
      </nav>
    );
  }
}

module.exports = NavBar;
