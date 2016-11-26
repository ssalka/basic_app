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
      { name: 'Home', path: '/app', icon: 'home' }
    ]
  }

  render() {
    const userCollections = _.get(this.state, 'user.library.collections', []);
    const sidebarLinks = this.state.views.concat(userCollections);
    return (
      <div id="app" className="flex-column">
        <NavBar />
        <div className="content flex-row">
          <SideBar links={sidebarLinks} />
          <main className="container-fluid">
            { this.props.children }
          </main>
        </div>
      </div>
    );
  }
}

module.exports = { App, Home };
