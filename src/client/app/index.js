import React from 'react';
const { ViewComponent, NavBar } = require('lib/client/components');
const Home = require('./home');

class App extends ViewComponent {
  render() {
    return (
      <div>
        <NavBar />
        { this.props.children }
      </div>
    );
  }
}

module.exports = { App, Home };
