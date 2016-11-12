import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createConnector } from 'cartiv';
import api from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { has, identity } from 'lodash';

const { Site, Splash, Login } = require('./site');
const { App, Home } = require('./app');

const { BaseComponent } = require('lib/client/components');
const { request, logger } = require('lib/common');
const { User } = api;

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
    else if (localStorage.token && !location.pathname.includes('/app')) {
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
    const NotFound = () => (
      <h2>Not found</h2>
    );

    return (
      <Router history={browserHistory}>
        {/* App */}
        <Route path="/app" component={App}
          onEnter={this.checkAuth}>
          <IndexRoute component={Home} />
          {/* other app views in here */}
        </Route>

        {/* Site */}
        <Route path="/" component={Site}>
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
