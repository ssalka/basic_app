import * as assert from 'assert';
import { mount, ReactWrapper } from 'enzyme';
import TypeSelect, { IProps as TypeSelectProps, IState as TypeSelectState } from 'lib/client/components/ui/TypeSelect';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';


describe('TypeSelect', () => {
  const testCollection = new MockCollection();
  let selectedType = FIELD_TYPES.STANDARD[1];
  let typeSelect: ReactWrapper<TypeSelectProps, TypeSelectState>;
  let typeSelectProps: TypeSelectProps;

  function getTypeSelect() {
    return mount(<TypeSelect {...typeSelectProps} />);
  }

  const expectedTree: Record<'standard' | 'collection', string[]> = {
    standard: _.map(FIELD_TYPES.STANDARD, 'name'),
    collection: [testCollection.name]
  };

  beforeEach(() => {
    typeSelectProps = {
      collections: [testCollection],
      selectedType: 'STRING',
      onSelectType: jest.fn()
    };
  });

  it('loads with the correct initial values', () => {
    typeSelect = getTypeSelect();
    assert(typeSelect.exists());

    const [standardTypeNode, collectionNode] = typeSelect.state('nodes');

    expect(_.map(standardTypeNode.childNodes, 'label')).toEqual(expectedTree.standard);

    typeSelect.instance().handleNodeClick({ id: 'category-collections' });

    expect(_.map(collectionNode.childNodes, 'label')).toEqual(expectedTree.collection);
  });
});
