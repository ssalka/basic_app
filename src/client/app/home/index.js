import React from 'react';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import { UserStore } from '../../api/stores';
import api from '../../api';
import _ from 'lodash';

_.mixin(require('lodash-inflection'));

const { ViewComponent } = require('../../components');
const { request } = require('lib/common');

const { User } = api;
const connect = createConnector(React);

@connect(UserStore)
class Home extends ViewComponent {
  static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  }

  get user() {
    return _.get(this.context, 'user', {});
  }

  get currentView() {
    // Stubbing out for now, but this should dynamically render a view
    const { user } = this;
    if (_.isEmpty(user)) return;

    const count = user.library.length;
    return user.library.length !== 0
      ? [
        `You have ${count} ${_.pluralize('collection', count)}:`,
        _.map(user.library, 'name').join(', ')
      ].join('\n')
      : 'You do not have any collections :(';
  }

  logout() {
    const { token } = localStorage;
    request.post('/logout', { token })
      .then(this.logoutCallback)
      .catch(console.error);
  }

  logoutCallback(req) {
    User.unset();
    delete localStorage.token;
    this.props.history.push('/');
  }

  greet() {
    const { user } = this;
    return user.username ? `Welcome, ${user.username}!` : null;
  }

  render() {
    return (
      <section>
        <h1>Home</h1>
        <div>
          { this.greet() }
          <br />
          { this.currentView }
          <br />
          <button onClick={this.logout}>Log Out</button>
        </div>
      </section>
    );
  }
};

module.exports = Home;
