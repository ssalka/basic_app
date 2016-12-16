import React from 'react';
import { createConnector } from 'cartiv';

import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';

import Home from './home';
import Collections from './collections';
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
      <FlexRow id="app">
        <SideBar links={sidebarLinks} />
        <div className="content bg-light">
          { this.props.children }
        </div>
      </FlexRow>
    );
  }
}

module.exports = { App, Home, Collections };
