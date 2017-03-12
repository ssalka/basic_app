declare const React;
import { Link } from 'react-router';
import { InputGroup } from '@blueprintjs/core';
import { IContext, ReactElement } from 'lib/client/interfaces';
import { BaseComponent, Button, Icon } from '../';
import '../../styles/Navbar.less';

export default (_, {appName, user}: IContext): ReactElement => (
  <nav className="pt-navbar pt-dark">
    <div className="pt-navbar-group pt-align-left">
      <Link to={user ? '/home' : '/'} className="pt-navbar-heading">
        {appName}
      </Link>
    </div>
    <div className="pt-navbar-group pt-align-right">
      {user ? (
        <InputGroup
          placeholder="Search"
          className="pt-inputs pt-round"
          leftIconName="search"
          rightElement={<Button minimal={true} icon="cross" />}
        />
      ) : null}
      <Link to={user ? '/logout' : '/login'}>
        <Button
          text={user ? null : 'Sign In'}
          icon="user"
          minimal={true}
          rounded={true}
        />
      </Link>
    </div>
  </nav>
);
