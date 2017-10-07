import * as assert from 'assert';
import { mount, ReactWrapper } from 'enzyme';
import { Collection, Field } from 'lib/common/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { TypeSelectPopover, ITypeSelectPopoverProps } from 'src/client/app/collection/form/components';

describe('TypeSelectPopover', () => {
  const testCollection = new MockCollection();
  const selectedType = FIELD_TYPES.STANDARD[1];
  let typeSelectPopover: ReactWrapper<ITypeSelectPopoverProps, {}>;
  let props: ITypeSelectPopoverProps;
  let popoverContainer: HTMLElement;

  function getTypeSelectPopover() {
    return mount(
      <TypeSelectPopover {...props} />,
      { attachTo: popoverContainer }
    );
  }

  beforeEach(() => {
    popoverContainer = document.createElement('div');
    document.body.appendChild(popoverContainer);

    props = {
      collections: [testCollection],
      onChange: jest.fn(),
      selectedType,
      inline: true,
      hoverCloseDelay: 0,
      hoverOpenDelay: 0,
      isOpen: true
    };

    typeSelectPopover = getTypeSelectPopover();
  });

  afterEach(() => {
    typeSelectPopover.detach();
    popoverContainer.remove();
  });

  it('renders the popover target and content', () => {
    assert(typeSelectPopover.exists());
    expect(typeSelectPopover.text()).toBe(selectedType.name);

    const types: string[] = _.map(
      document.querySelectorAll('.pt-tree-node-list .pt-tree-node-label'),
      'textContent'
    );

    expect(types).toEqual([
      'Standard Types',
      ..._.map(FIELD_TYPES.STANDARD, 'name'),
      'Collections'
    ]);
  });
});
