import * as React from 'react';
import { NavBar } from 'lib/client/components';
import { mountWithStore } from 'test/utils';

describe('NavBar', () => {
  let user;

  function getNavBar() {
    return mountWithStore(<NavBar user={user} />);
  }

  describe('when no user is signed in', () => {
    beforeEach(() => (user = null));

    it('shows the sign-in button', () => {
      const navbar: string = getNavBar();
      const button = navbar.find('button').last();
      expect(button.text()).toBe('Sign In');
    });
  });

  describe('when a user is signed in', () => {
    beforeEach(() => (user = { username: 'ssalka' }));

    it('shows the logout button', () => {
      const navbar = getNavBar();
      const button = navbar.find('button').last();
      expect(button.text()).toBe('');
    });
  });
});
