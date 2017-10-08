declare const React;
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { InputGroup } from '@blueprintjs/core';
import { IUser } from 'lib/common/interfaces';
import { Button } from '../';
import '../../styles/Navbar.less';

interface INavBarProps {
  title: string;
  user?: IUser;
}

export default ({ title, user }: INavBarProps) => (
  <Router>
    <nav className="pt-navbar pt-dark">
      <div className="pt-navbar-group pt-align-left">
        <Link to={user ? '/home' : '/'} className="pt-navbar-heading">
          {title}
        </Link>
      </div>
      <div className="pt-navbar-group pt-align-right">
        {user && (
          <InputGroup
            placeholder="Search"
            className="pt-inputs pt-round"
            leftIconName="search"
            rightElement={<Button minimal={true} icon="cross" />}
          />
        )}
          <Link to={user ? '/logout' : '/login'}>
            <Button
              text={!user && 'Sign In'}
              icon="user"
              minimal={true}
              rounded={true}
            />
          </Link>
      </div>
    </nav>
  </Router>
);
