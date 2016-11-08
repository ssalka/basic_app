import React from 'react';
import { Link } from 'react-router';
import { ViewComponent } from 'lib/client/components';
import './styles.less';

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
      <section className="green">
        <h1>Welcome to { context.appName }</h1>
        <div>{ EnterLink }</div>
      </section>
    );
  }
};

module.exports = Splash;
