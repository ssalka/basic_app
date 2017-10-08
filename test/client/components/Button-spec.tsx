import * as React from 'react';
import { mount } from 'enzyme';
import { Button } from 'lib/client/components';

describe('Button', () => {
  function getButton(props) {
    return mount(<Button {...props} />).find('Button');
  }

  it('maps `props` to the `className` attribute', () => {
    const button = getButton({
      className: 'test-class',
      icon: 'blank',
      size: 'large',
      rounded: true,
      color: 'success',
      minimal: true
    });

    const expectedClassNames = [
      'btn',
      'test-class',
      'icon',
      'pt-icon-blank',
      'pt-icon-large',
      'rounded',
      'pt-intent-success',
      'pt-minimal'
    ];

    expect(button.props().className).toEqual(expectedClassNames.join(' '));
  });

  it('displays text from the `text` attribute', () => {
    const button = getButton({
      icon: 'blank',
      text: 'Test Button'
    });

    expect(button.text()).toBe('Test Button');
  });

  it('handles an onClick when triggered', done => {
    const button = getButton({
      onClick: () => done()
    });

    button.simulate('click');
  });
});
