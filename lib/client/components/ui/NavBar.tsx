declare const React;
import { Link } from 'react-router';
import { InputGroup } from '@blueprintjs/core';
import { IContext, ReactElement } from 'lib/client/interfaces';
import { BaseComponent, Button, Icon } from '../';
import '../../styles/Navbar.less';

export default class NavBar extends BaseComponent<any, any> {
  public static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  public render() {
    const { appName, user }: IContext = this.context;

    return (
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
  }
}
