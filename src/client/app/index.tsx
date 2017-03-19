declare const _;
declare const React;
import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import { IUser, IView, IRouteProps, ReactElement, Collection } from 'lib/client/interfaces';
import { connect, UserStore } from 'lib/client/api/stores';
import Home from './home';
import Collections from './collections';
import './styles.less';

interface IAppState {
  user: IUser;
  views: Partial<IView>[];
}

@connect(UserStore)
class App extends ViewComponent<{}, IAppState> {
  public state: IAppState = {
    user: {} as IUser,
    views: [
      { name: 'Home', path: '/home', icon: 'home' }
    ]
  };

  public render() {
    const {
      props: { children },
      state: { user, views }
    } = this;

    const { path } = (children as ReactElement).props.route;
    const collections: Collection[] = _.get(user, 'library.collections', []).slice(0, 5);
    const links: any[] = views.concat(collections as any);

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
export { Home, Collections };
