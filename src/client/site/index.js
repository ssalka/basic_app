import React from 'react';

import { ViewComponent } from 'lib/client/components';
import Login from './login';
import Splash from './splash';

class Site extends ViewComponent {
  render() { return this.props.children; }
}

module.exports = { Site, Login, Splash };
