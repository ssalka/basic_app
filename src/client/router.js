import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createConnector } from 'cartiv';
import { has, identity } from 'lodash';

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { BaseComponent, ViewComponent, NavBar } from 'lib/client/components';
import { AddCollectionView } from 'lib/client/views';
import { request, logger } from 'lib/common';
import Splash from './splash';
import Login from './login';
import { App, Home } from './app';
import './styles.less';

// TODO: implement token validation - post to /auth ?
const validateToken = token => !!token;

const connect = createConnector(React);

@connect(UserStore)
class AppRouter extends BaseComponent {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  }

  getChildContext() {
    const context = { appName: document.title };
    if (this.state.user) context.user = this.state.user;
    return context;
  }

  componentWillMount() {
    if (localStorage.user) {
      User.set(JSON.parse(localStorage.user));
    }
    else if (localStorage.token && !location.pathname.includes('/home')) {
      this.checkAuth(this.state);
    }
  }

  // Check whether a user is logged in
  checkAuth(nextState, replace, next=identity) {
    if (this.state.user || this.context.user) return next();

    request.get('/me')
      .then(({ status, body }) => {
        if (status !== 200) logger.error(body.err);
        const { user } = body;

        if (replace && !user) {
          replace('/login');
        }
        else if (!this.state.user) {
          User.set(user);
          localStorage.user = JSON.stringify(user);
        }

        next();
      })
      .catch(err => {
        logger.error('Unable to retrieve user:', err);
        if (replace) replace('/login');
        next();
      });
  }

  logout() {
    const { token } = localStorage;
    if (token) {
      request.post('/logout', { token })
        .then(this.logoutCallback)
        .catch(console.error);
    }
  }

  logoutCallback() {
    User.unset();
    browserHistory.push('/');
  }

  render() {
    const Site = ({children}) => (
      <div className="viewport flex-column">
        <NavBar />
        <main className="bg-light">
          {children}
        </main>
      </div>
    );

    const NotFound = () => (
      <ViewComponent>
        <h2>Not found</h2>
      </ViewComponent>
    );

    const Collections = () => <span>Collections View</span>;

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>

          <Route component={App} onEnter={this.checkAuth}>
            <Route path="home" component={Home} />
            <Route path="collections">
              <IndexRoute component={Collections} />
              <Route path="add" component={AddCollectionView} />
            </Route>
          </Route>

          <IndexRoute component={Splash} />
          <Route path="login" component={Login} />
          <Route path="logout" onEnter={this.logout} />
          <Route path="*" component={NotFound} />

        </Route>
      </Router>
    );
  }
};

module.exports = AppRouter;
