import * as React from 'react';
import Link from 'react-router-redux-dom-link';
import { IUser } from 'lib/common/interfaces';
import { Button } from '../';
import '../../styles/Navbar.less';

interface INavBarProps {
  title: string;
  user?: IUser;
}

export default ({ title, user }: INavBarProps) => (
  <nav className="pt-navbar pt-dark">
    <div className="pt-navbar-group pt-align-left">
      <Link to={user ? '/home' : '/'} className="pt-navbar-heading">
        {title}
      </Link>
    </div>
    <div className="pt-navbar-group pt-align-right">
      {__DEV__ && (
        <a href="https://github.com/ssalka/basic_app" target="_blank">
          <Button icon="git-repo" minimal={true} rounded={true} />
        </a>
      )}

      <Link to={user ? '/logout' : '/login'}>
        <Button text={!user && 'Sign In'} icon="user" minimal={true} rounded={true} />
      </Link>
    </div>
  </nav>
);
