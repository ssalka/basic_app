import * as assert from 'assert';
import { mount, ReactWrapper } from 'enzyme';
import TypeSelect, {
  IProps as TypeSelectProps,
  IState as TypeSelectState,
  collectionToTreeNode,
  typeToTreeNode
} from 'lib/client/components/ui/TypeSelect';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';

describe('TypeSelect', () => {
  const testCollection = new MockCollection();
  const collections = [testCollection];
  const selectedType = FIELD_TYPES.STANDARD[1];
  let typeSelect: ReactWrapper<TypeSelectProps, TypeSelectState> | TypeSelect;
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
      collections,
      selectedType,
      onSelectType: jest.fn()
    };
  });

  it('loads with the correct initial values', () => {
    typeSelect = getTypeSelect();
    assert(typeSelect.exists());

    const [standardTypesNode, collectionsNode] = typeSelect.state('nodes');

    expect(_.map(standardTypesNode.childNodes, 'label')).toEqual(expectedTree.standard);

    typeSelect.instance().handleNodeClick({ id: 'category-collections' });

    expect(_.map(collectionsNode.childNodes, 'label')).toEqual(expectedTree.collection);
  });

  describe('#getNodes', () => {
    it('returns an array of tree nodes', () => {
      typeSelect = getTypeSelect();

      const [standardTypeNodes, collectionNodes] = _.map(
        typeSelect.instance().getNodes(collections, selectedType),
        'childNodes'
      );

      expect(standardTypeNodes).toEqual(
        FIELD_TYPES.STANDARD.map(typeToTreeNode(selectedType))
      );

      expect(collectionNodes).toEqual(
        collections.map(collectionToTreeNode(selectedType))
      );
    });
  });

  describe('#handleNodeClick', () => {
    it('expands/closes categories', () => {
      typeSelect = getTypeSelect().instance();
      typeSelect.toggleNode = jest.fn();

      const categoryToExpand = typeSelect.state.nodes[1];

      typeSelect.handleNodeClick(categoryToExpand);

      expect(typeSelect.toggleNode).toHaveBeenCalledWith(categoryToExpand);
    });

    it('calls the onSelectType prop with the id of the new type', () => {
      typeSelect = getTypeSelect().instance();

      const typeToSelect = typeSelect.state.nodes[0].childNodes[2];

      typeSelect.handleNodeClick(typeToSelect);

      expect(typeSelectProps.onSelectType).toHaveBeenCalledWith({
        _collection: undefined,
        type: typeToSelect.id
      });
    });

    it('updates the isSelected field of the newly selected tree node', () => {
      typeSelect = getTypeSelect().instance();

      const getNewType = () => typeSelect.state.nodes[0].childNodes[2];

      assert(typeSelect.state.nodes[0].childNodes[1].isSelected, 'node 1 is not selected');

      typeSelect.handleNodeClick(getNewType());
      assert(!typeSelect.state.nodes[0].childNodes[1].isSelected, 'node 1 was not deselected');
      assert(typeSelect.state.nodes[0].childNodes[2].isSelected, 'node 2 was not selected');

      typeSelect.handleNodeClick(getNewType());
      assert(!typeSelect.state.nodes[0].childNodes[2].isSelected, 'node 2 was not deselected');
    });
  });
});
