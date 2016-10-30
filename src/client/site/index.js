import React from 'react';
const { ViewComponent } = require('../components');

class Site extends ViewComponent {
  render() { return this.props.children; }
}

const Login = require('./login');
const Splash = require('./splash');

module.exports = { Site, Login, Splash };
