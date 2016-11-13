import React from 'react';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';

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

  greet() {
    const { user } = this;
    return user.username ? `Welcome, ${user.username}!` : null;
  }

  render() {
    return (
      <section className="container">
        <h1>Home</h1>
        <div>
          { this.greet() }
          <br />
          { this.currentView }
        </div>
      </section>
    );
  }
};

module.exports = Home;
