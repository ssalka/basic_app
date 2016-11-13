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
    const { user } = this;
    if (_.isEmpty(user)) return;

    return _(user.library)
      .mapValues('length')
      .map((count, name) => count > 0 ? [
        `You have ${count} ${_(name).singularize().pluralize(count)}:`,
        user.library[name].join(', ')
      ].join('\n') : `You do not have any ${name}`)
      .map((text, key) => <p key={key}>{text}</p>)
      .value();
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
          <p>{this.greet()}</p>
          {this.currentView}
        </div>
      </section>
    );
  }
};

module.exports = Home;
