import axios from 'axios';
import { Flex } from 'grid-styled';
import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps, Redirect, Route, Switch } from 'react-router';

import api from 'lib/client/api';
import { getCollectionStore } from 'lib/client/api/stores';
import { connect } from 'lib/client/api/stores/redux';
import {
  BaseComponent,
  ViewComponent,
  FlexColumn,
  NavBar
} from 'lib/client/components';
import { request, logger } from 'lib/common';
import {
  Collection as ICollection,
  Field,
  IComponentModule,
  IUser,
  ReactElement,
  IReduxProps
} from 'lib/common/interfaces';
import Splash from './splash';
import Login from './login';
import App from './app';
import './styles.less';

const { Collection } = api;

@connect
class AppRouter extends BaseComponent<Partial<IReduxProps>> {
  componentDidMount() {
    if (!localStorage.token) {
      return;
    }

    this.props.actions.fetchUser();
  }

  componentWillUpdate({ store }) {
    const { user: currentUser } = this.props.store.user;
    const { user: nextUser } = store.user;

    // TODO: achieve the following with redux
    if (nextUser && !_.isEqual(currentUser, nextUser)) {
      nextUser.library.collections.forEach(collection =>
        // register store for each collection
        getCollectionStore({ collection })
      );

      Collection.add(nextUser.library.collections);
    }
  }

  renderIfAuthenticated = props =>
    this.props.store.user.user ? this.renderWithStore(App, props) : <div />;

  logout = () => (this.props.actions.userLogout(), <Redirect to="/" />);

  renderWithStore = _.curry(
    (Component: React.ComponentType, props: RouteComponentProps<any>) => (
      <Component {...this.props} {...props} />
    )
  );

  render() {
    return (
      <Flex column={true} align="stretch">
        <NavBar title="App Name" user={this.props.store.user.user} />
        <Switch>
          <Route path="/" exact={true} component={Splash} />
          <Route
            path="/login"
            exact={true}
            render={this.renderWithStore(Login)}
          />
          <Route path="/logout" exact={true} render={this.logout} />
          <Route render={this.renderIfAuthenticated} />
          <Route path="/:param" render={NotFound} />
        </Switch>
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
