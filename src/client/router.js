import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { createConnector } from 'cartiv';
import _ from 'lodash';

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { BaseComponent, ViewComponent, NavBar } from 'lib/client/components';
import { request, logger } from 'lib/common';
import Splash from './splash';
import Login from './login';
import { App, Home } from './app';
import './styles.less';

const connect = createConnector(React);

const getCurrentUser = gql`query {
  me {
    _id
    username
    library {
      collections {
        _id
        name
      }
    }
  }
}`;

@connect(UserStore)
@graphql(getCurrentUser, {
  props: ({ data }) => ({
    user: data.me,
    loading: data.loading,
    error: data.error
  })
})
class AppRouter extends BaseComponent {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  }

  getChildContext() {
    const context = { appName: document.title };
    if (this.props.user) {
      context.user = this.props.user;
      User.set(this.props.user);
    }
    return context;
  }

  // Only load protected routes if a user is logged in
  checkAuth(nextState, replace, next=_.identity) {
    if (!this.props.user) replace('/login');
    next();
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

  get components() {
    return {
      Site: ({children}) => (
        <div className="viewport flex-column">
          <NavBar />
          <main className="bg-light">
            {children}
          </main>
        </div>
      ),
      NotFound: () => (
        <ViewComponent>
          <h2>Not found</h2>
        </ViewComponent>
      )
    };
  }

  render() {
    const { Site, NotFound } = this.components;

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Site}>
          <IndexRoute component={Splash} />
          <Route path="login" component={Login} />
          <Route path="logout" onEnter={this.logout} />
          <Route component={App} onEnter={this.checkAuth}>
            <Route path="home" component={Home} />
            {/* other app views in here */}
            <Route path="*" component={NotFound} />
          </Route>
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
};

module.exports = AppRouter;
