import { mount } from 'enzyme';
import { NavBar } from 'lib/client/components';

describe("NavBar", () => {
  function getNavBar(context) {
    return mount(<NavBar />, { context });
  }

  it("shows the sign-in button if there is no user", () => {
    const navbar = getNavBar();
    const button = navbar.find('button');
    expect(button.text()).toBe('Sign In');
  });

  it("shows the logout button if there is a user", () => {
    const navbar = getNavBar({ user: { username: 'ssalka' } });
    const button = navbar.find('button').last();
    expect(button.text()).toBe('');
  });

  it("shows a search input if there is a user", () => {
    const navbar = getNavBar({ user: { username: 'ssalka' } });
    const search = navbar.find('input');
    expect(search.prop('placeholder')).toBe('Search');
  });
});
