import React from 'react';
import { createConnector } from 'cartiv';

import { ViewComponent, NavBar, SideBar } from 'lib/client/components';
import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';

import Home from './home';
import './styles.less';

const connect = createConnector(React);

@connect(UserStore)
class App extends ViewComponent {
  state = {
    views: [
      { name: 'Home', path: '/home', icon: 'home' }
    ]
  }

  render() {
    const userCollections = _.get(this.state, 'user.library.collections', []).slice(0, 5);
    const sidebarLinks = this.state.views.concat(userCollections);
    return (
      <div id="app" className="flex-row">
        <SideBar links={sidebarLinks} />
        <div className="content bg-light">
          { this.props.children }
        </div>
      </div>
    );
  }
}

module.exports = { App, Home };
