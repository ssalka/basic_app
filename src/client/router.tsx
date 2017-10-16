import { Flex } from 'grid-styled';
import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps, Redirect, Route, Switch } from 'react-router';

import { connect } from 'lib/client/api/store';
import { BaseComponent, ViewComponent, NavBar } from 'lib/client/components';
import { IReduxProps } from 'lib/common/interfaces';
import Splash from './splash';
import Login from './login';
import App from './app';
import './styles.less';

@connect
class AppRouter extends BaseComponent<Partial<IReduxProps>> {
  componentDidMount() {
    if (localStorage.token) {
      // verify user session with token
      this.props.actions.fetchUser();
    }
  }

  renderIfAuthenticated = props =>
    this.props.store.user.user ? this.renderWithStore(App, props) : <div />;

  logout = () => {
    const { token } = localStorage;

    if (token) this.props.actions.userLogout(token);

    return <Redirect to="/" />;
  };

  renderWithStore = _.curry(
    (Component: React.ComponentType, props: RouteComponentProps<any>) => (
      <Component {...this.props} {...props} />
    )
  );

  render() {
    return (
      <Flex column={true} align="stretch">
        <NavBar title="App Name" user={this.props.store.user.user} />
        <Switch>
          <Route path="/" exact={true} component={Splash} />
          <Route
            path="/login"
            exact={true}
            render={this.renderWithStore(Login)}
          />
          <Route path="/logout" exact={true} render={this.logout} />
          <Route render={this.renderIfAuthenticated} />
          <Route path="/:param" render={NotFound} />
        </Switch>
      </Flex>
    );
  }
}

const NotFound = ({ match }) => (
  <ViewComponent>
    <h2>Not found: {match.params.param}</h2>
  </ViewComponent>
);

export default AppRouter;
