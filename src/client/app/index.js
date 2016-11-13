import React from 'react';
import { ViewComponent, NavBar, SideBar } from 'lib/client/components';
import Home from './home';
import './styles.less';

class App extends ViewComponent {
  state = {
    views: [
      { name: 'Home', path: '/app', icon: 'home' },
      { name: 'Music', path: '/music', icon: 'music' },
      { name: 'Todo', path: '/todo', icon: 'confirm' }
    ]
  }

  render() {
    return (
      <div id="app" className="flex-column">
        <NavBar />
        <div className="content flex-row">
          <SideBar links={this.state.views} />
          <main className="container-fluid">
            { this.props.children }
          </main>
        </div>
      </div>
    );
  }
}

module.exports = { App, Home };
