declare const _;
declare const React;
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Flex } from 'grid-styled';

import api from 'lib/client/api';
import { connect, getCollectionStore, UserStore } from 'lib/client/api/stores';
import { BaseComponent, ViewComponent, FlexColumn, NavBar } from 'lib/client/components';
import { request, logger } from 'lib/common';
import Splash from './splash';
import Login from './login';
import App from './app';
import {
  Collection as ICollection,
  Field,
  IComponentModule,
  IContext,
  IUser,
  ReactElement
} from 'lib/common/interfaces';
import './styles.less';

const { User, Collection } = api;

interface IAppRouterState {
  user?: IUser;
}

@connect(UserStore)
class AppRouter extends BaseComponent<{}, IAppRouterState> {
  static childContextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  renderIfAuthenticated = props => this.state.user ? <App {...props} /> : <div />;

  componentDidMount() {
    if (!localStorage.token) {
      return;
    }

    axios.get('/api/me')
      .then(({ data: { user } }) => {
        User.set(user);

        user.library.collections.forEach(
          collection => getCollectionStore({ collection })
        );
      })
      .catch(err => {
        if (err.response.status === 403 && location.pathname !== '/login') {
          console.log('redirect to login');
        }
      });
  }

  getChildContext(): IContext {
    const context: IContext = { appName: document.title };

    if (this.state.user) {
      context.user = this.state.user;
      User.set(this.state.user);
      Collection.add(this.state.user.library.collections);
    }

    return context;
  }

  logout({ history }) {
    const { token } = localStorage;
    if (token) {
      request.post('/logout', { token })
        .then(() => {
          User.unset();
          history.push('/');
        })
        .catch(console.error);
    }

    return (
      <div>
        Logging out...
      </div>
    );
  }

  render() {
    return (
      <Flex column={true} align="stretch">
        <NavBar />
        <Router>
          <Switch>
            <Route path="/" exact={true} component={Splash} />
            <Route path="/login" component={Login} />
            <Route path="/logout" render={this.logout} />
            <Route render={this.renderIfAuthenticated} />
            <Route path="/:param" render={NotFound} />
          </Switch>
        </Router>
      </Flex>
    );
  }
}

const NotFound = ({ match }) => (
  <ViewComponent>
    <h2>Not found: {match.params.param}</h2>
  </ViewComponent>
);

export default AppRouter;
