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
  };

  render() {
    const {
      props: { children },
      state: { user, views }
    } = this;

    const { path } = children.props.route;
    const collections = _.get(user, 'library.collections', []).slice(0, 5);
    const links = views.concat(collections);

    return (
      <FlexRow id="app">
        <SideBar links={links} currentPath={path} />
        <div id="content">
          {children}
        </div>
      </FlexRow>
    );
  }
}

module.exports = { App, Home, Collections };
