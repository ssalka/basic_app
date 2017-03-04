declare const _;
declare const React;
import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import { User } from 'lib/client/api';
import { connect, UserStore } from 'lib/client/api/stores';
import Home = require('./home');
import Collections = require('./collections');
import './styles.less';

interface AppState {
  user: any;
  views: any[];
}

@connect(UserStore)
class App extends ViewComponent<any, AppState> {
  state: AppState = {
    user: {},
    views: [
      { name: 'Home', path: '/home', icon: 'home' }
    ]
  };

  render() {
    const {
      props: { children },
      state: { user, views }
    } = this;

    const { path } = (children as any).props.route;
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

export default App;
export { Home };
export { Collections };
