import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'lib/client/components';

describe("Button", () => {
  function getButton(props) {
    return shallow(
      <Button {...props} />
    );
  }

  it("maps `props` to the `className` attribute", () => {
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
      'pt-large',
      'rounded',
      'pt-intent-success',
      'pt-minimal'
    ];

    expect(button.props().className).toEqual(
      expectedClassNames.join(' ')
    );
  });

  it("displays text from the `text` attribute", () => {
    const button = getButton({
      icon: 'blank',
      text: 'Test Button'
    });

    expect(button.children().text()).toBe('Test Button');
  });

  it("handles an onClick when triggered", done => {
    const button = getButton({
      onClick: done
    });

    button.simulate('click');
  });
});
