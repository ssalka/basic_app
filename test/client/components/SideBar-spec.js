import React from 'react';
import { mount } from 'enzyme';
import { SideBar } from 'lib/client/components';

describe("SideBar", () => {

  let $;
  let sidebar;
  const links = [
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Collections', path: '/collections', icon: 'graph' }
  ];

  beforeEach(() => {
    sidebar = mount(
      <SideBar links={links} currentPath="home" />
    );

    $ = (...args) => sidebar.find(...args);
  });

  it("loads with the proper `className`", () => {
    expect(sidebar.state('expanded')).toBe(false);
    expect($('aside').prop('className')).not.toContain('expanded');
  });

  it("applies styling via `className` to expand", () => {
    sidebar.setState({ expanded: true });
    expect($('aside').prop('className')).toContain('expanded');
  });

  it("expands/closes when the arrow icon is clicked", () => {
    $('#sidebar-expand .icon').simulate('click');
    expect(sidebar.state('expanded')).toBe(true);
  });

  it("expands/closes on double-click", () => {
    sidebar.simulate('click').simulate('click');
    expect(sidebar.state('expanded')).toBe(true);
  });

  it("doesn't expand/close on single clicks", () => {
    sidebar.simulate('click');
    expect(sidebar.state('expanded')).toBe(false);
  });

  it("doesn't expand/close on double-clicks more than 0.5s apart", done => {
    sidebar.simulate('click');
    setTimeout(() => {
      sidebar.simulate('click');
      expect(sidebar.state('expanded')).toBe(false);
      done();
    }, 501);
  });

  it("doesn't expand/close on double-clicks within the ul", () => {
    $('ul').simulate('click').simulate('click');
    expect(sidebar.state('expanded')).toBe(false);
  });

  it("renders a list of collection pages", () => {
    $('li').forEach((li, i) => {
      const link = links[i];
      expect(li.find('.text').text()).toBe(link.name);
      expect(li.find('Link').prop('to')).toBe(link.path)
      expect(li.find('.icon').prop('className')).toContain(link.icon);
    });
  });

  it("sets class `active` on the active list item", () => {
    expect($('li').first().prop('className')).toContain('active');
  });
});
