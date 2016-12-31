import React from 'react';
import { Link } from 'react-router';
import { InputGroup } from '@blueprintjs/core';

import { BaseComponent, Button, Icon } from './';
import '../styles/Navbar.less';

class NavBar extends BaseComponent {
  static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  render() {
    const { appName, user } = this.context;
    const crossIcon = <Button minimal={true} icon="cross" />;

    return (
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to={user ? '/home' : '/'} className="pt-navbar-heading">
            {appName}
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
