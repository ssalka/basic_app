declare const _;
declare const React;
import { ViewComponent, FlexRow, NavBar, SideBar } from 'lib/client/components';
import { ILink, IUser, IRouteProps, ReactElement, IQueryProps, Collection } from 'lib/common/interfaces';
import { connect, UserStore } from 'lib/client/api/stores';
import Home from './home';
import Collections from './collections';
import './styles.less';

interface IState {
  user: IUser;
  navLinks: ILink[];
}

interface IProps extends IQueryProps {}

@connect(UserStore)
class App extends ViewComponent<IProps, IState> {
  public state: IState = {
    user: {} as IUser,
    navLinks: [
      { name: 'Home', path: '/home', icon: 'home' }
    ]
  };

  public render() {
    const {
      props: { children },
      state: { user, navLinks }
    } = this;

    const { path } = (children as ReactElement).props.route;
    const viewLinks: ILink[] = _(user)
      .get('library.collections', [])
      .slice(0, 5)
      .map((collection: Collection) => _.pick(
        collection, ['name', 'path', 'icon']
      ));
    const links: ILink[] = navLinks.concat(viewLinks);

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
