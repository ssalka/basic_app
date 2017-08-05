import * as assert from 'assert';
import { mount, ReactWrapper } from 'enzyme';
import { Collection, Field } from 'lib/client/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { TypeSelectPopover, ITypeSelectPopoverProps } from 'src/client/app/collection/form/components';

describe('TypeSelectPopover', () => {
  const testCollection = new MockCollection();
  let typeSelectPopover: ReactWrapper<ITypeSelectPopoverProps, {}>;
  let props: ITypeSelectPopoverProps;
  let popoverContainer: HTMLElement;
  let selectedType = FIELD_TYPES.STANDARD[1];

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

  it('renders', () => {
    assert(typeSelectPopover.find(`.pt-popover-target`).exists());
    expect(typeSelectPopover.find(`.pt-popover-target`).text()).toBe(selectedType.name);

    const types: string[] = _.map(
      document.querySelectorAll('.pt-tree-node-list .pt-tree-node-label'),
      'textContent'
    );

    expect(types).toEqual([
      'Standard Types',
      ..._.map(FIELD_TYPES.STANDARD, 'name'),
      'Collections',
      // TODO: pass collections down to TypeSelect
    ]);
  });
});
