import * as assert from 'assert';
import * as _ from 'lodash';
import * as React from 'react';
import { RenderingService } from 'lib/client/services';
import { CollectionField } from 'lib/common/interfaces';
import { BaseComponent } from 'lib/client/components';
import { shallow } from 'enzyme';

describe('Rendering Service', () => {
  describe('#isNonemptyField', () => {
    const { isNonemptyField } = RenderingService;

    it('returns true if a field value is well-defined', () => {
      // NOTE: well-defined ~== truthy || 0 (or if an array, recursively evaluates each element)

      const nonemptyValues: any[] = [
        'Truthy string',
        0,
        new Date(),
        [null, null, 'Anything', null, undefined]
      ];

      assert(_.every(nonemptyValues, isNonemptyField));
    });

    it('returns false for falsy values and empty arrays', () => {
      const isEmptyField = _.negate(isNonemptyField);

      const emptyValues = [null, undefined, [], [null]];

      assert(_.every(emptyValues, isEmptyField));
    });
  });

  describe('#getProps', () => {
    const { getProps } = RenderingService;

    it('returns an object containing the prop and value to set on a React element', () => {
      const testCases = [
        [{ key: 'value' }, { name: 'key', renderMethod: 'PLAIN_TEXT' }],
        [{ rating: 4.5 }, { name: 'rating', renderMethod: 'RATING' }]
      ];

      expect(testCases.map(_.spread(getProps))).toEqual([
        { children: 'value' },
        { initialRate: 4.5 }
      ]);
    });
  });

  describe('#renderField', () => {
    it('renders a React element, given document, field to render, and optional props', done => {
      const field = new CollectionField('target');
      const document = { target: 'Display Text' };
      const props = { onClick: done };
      const expectedProps = _.assign({}, props, {
        children: document.target
      });

      const Component: SFC = () => RenderingService.renderField(document, field, props);
      const renderedField = shallow(<Component />);

      expect(_.first(renderedField.getElements()).props).toEqual(expectedProps);

      renderedField.simulate('click');
    });
  });
});
