import React from 'react';
const { ViewComponent } = require('../components');
const Home = require('./home');

class App extends ViewComponent {
  render() { return this.props.children; }
}

module.exports = { App, Home };
