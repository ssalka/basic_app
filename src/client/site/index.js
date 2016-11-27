import React from 'react';

import { ViewComponent, NavBar } from 'lib/client/components';
import Login from './login';
import Splash from './splash';
import './styles.less';

class Site extends ViewComponent {
  render() {
    return (
      <div id="site" className="flex-column">
        <NavBar />
        { this.props.children }
      </div>
    );
  }
}

module.exports = { Site, Login, Splash };
