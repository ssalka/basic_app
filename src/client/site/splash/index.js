import React from 'react';
import { Link } from 'react-router';
const { ViewComponent } = require('../../components');

// no lodash???

class Splash extends ViewComponent {
  static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  }

  render() {
    const { context } = this;
    const EnterLink = _.isEmpty(context.user)
      ? <Link to="/login">Log In</Link>
      : <Link to="/app">{ context.user.username }</Link>;

    return (
      <section>
        <h1>Welcome to { context.appName }</h1>
        <div>{ EnterLink }</div>
      </section>
    );
  }
};

module.exports = Splash;
