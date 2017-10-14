import { mount } from 'enzyme';
import * as React from 'react';
import { SideBar } from 'lib/client/components';
import { ILink } from 'lib/common/interfaces';
import { mountWithStore } from 'test/utils';

describe('SideBar', () => {
  let $;
  let sidebar;
  const links: ILink[] = [
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Collections', path: '/collections', icon: 'graph' }
  ];

  beforeEach(() => {
    sidebar = mountWithStore(<SideBar links={links} currentPath="home" />);

    $ = (...args) => sidebar.find('.sidebar').find(...args);
  });

  it('loads with the proper `className`', () => {
    expect($('aside').prop('className')).not.toContain('expanded');
  });

  it('expands/closes when the arrow icon is clicked', () => {
    $('#sidebar-expand .icon').simulate('click');
    expect($('aside').prop('className')).toContain('expanded');
  });

  it('expands/closes on double-click', () => {
    sidebar.simulate('click').simulate('click');
    expect($('aside').prop('className')).toContain('expanded');
  });

  it("doesn't expand/close on single clicks", () => {
    sidebar.simulate('click');
    expect($('aside').prop('className')).not.toContain('expanded');
  });

  it("doesn't expand/close on double-clicks more than 0.5s apart", done => {
    sidebar.simulate('click');
    setTimeout(() => {
      sidebar.simulate('click');
      expect($('aside').prop('className')).not.toContain('expanded');
      done();
    }, 501);
  });

  it("doesn't expand/close on double-clicks within the ul", () => {
    $('ul')
      .simulate('click')
      .simulate('click');
    expect($('aside').prop('className')).not.toContain('expanded');
  });

  it('renders a list of collection pages', () => {
    $('li').forEach((li, i) => {
      const link = links[i];
      expect(li.find('.icon').prop('className')).toContain(link.icon);
      expect(li.find('.text').text()).toBe(link.name);
      expect(li.find('Link').prop('to')).toBe(link.path);
    });
  });

  it('sets class `active` on the active list item', () => {
    expect(
      $('li')
        .first()
        .prop('className')
    ).toContain('active');
  });
});
