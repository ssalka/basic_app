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

  componentDidMount() {
    User.get();
  }

  componentDidUpdate(props, state) {
    if (state.users)  {
      console.log('got users', state.users);
    }
  }

  get user() {
    return _.get(this.context, 'user', {});
  }

  displayList(count, name) {
    const verboseCount = `You have ${count} ${_(name).singularize().pluralize(count)}`;
    const listItems = this.user.library[name].join(', ');
    return count > 0
      ? `${verboseCount}: ${listItems}`
      : `You do not have any ${name}`;
  }

  get currentView() {
    const { user } = this;
    if (_.isEmpty(user)) return;

    return _(user.library)
      .mapValues('length')
      .map(this.displayList)
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
