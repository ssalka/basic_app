import { Link } from 'react-router';
import { ViewComponent } from 'lib/client/components';

class Splash extends ViewComponent {
  static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  render() {
    const { context } = this;
    const EnterLink = _.isEmpty(context.user)
      ? <Link to="/login">Log In</Link>
      : <Link to="/home">{ context.user.username }</Link>;

    return (
      <div className="view">
        <div className="container">
          <h1>Welcome to { context.appName }</h1>
          <div>{ EnterLink }</div>
        </div>
      </div>
    );
  }
};

module.exports = Splash;
