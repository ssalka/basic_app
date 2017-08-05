import * as assert from 'assert';
import { mount } from 'enzyme';
import { Collection, Field } from 'lib/client/interfaces';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { CollectionForm } from 'src/client/app/collection/form';

describe("CollectionForm", () => {
  const testCollection = new MockCollection();
  let collectionForm;
  let elements: Record<string, any> = {};

  function getCollectionForm() {
    return mount(<CollectionForm collection={testCollection} />);
  }

  beforeEach(() => {
    collectionForm = getCollectionForm();
    elements.header = collectionForm.find('.header');
    elements.schema = collectionForm.find('.form-main');
    elements.addFieldRow = collectionForm.find('.minimal-row');
    elements.actionButtons = collectionForm.find('.action-buttons');
  });

  it("loads with the right initial state", () => {
    expect(collectionForm.state()).toEqual({
      collection: testCollection,
      collections: [testCollection]
    });
  });

  it("renders each section", () => {
    _.forEach(elements, element => assert(element.exists()));
  });

  describe("#updateCollection", () => {
    it("updates top-level properties of the collection", () => {
      const updates: Partial<Collection> = {
        name: 'Something Else',
        icon: 'graph'
      };

      collectionForm.instance().updateCollection(updates);
      expect(collectionForm.state('collection').name).toBe(updates.name);
      expect(collectionForm.state('collection').icon).toBe(updates.icon);
    });
  });

  describe("#updateFieldInCollection", () => {
    let fields: Field[];

    beforeEach(() => fields = collectionForm.state('collection').fields.slice());

    it("updates an existing field in the schema", () => {
      collectionForm.instance().updateFieldInCollection(0, { name: 'Updated Name' });
      expect(collectionForm.state('collection').fields[0].name).toBe('Updated Name');
    });

    it("adds a new field to the schema", () => {
      collectionForm.instance().updateFieldInCollection(fields.length);
      expect(collectionForm.state('collection').fields.length).toBe(fields.length + 1);
    });

    it("removes a field from the schema", () => {
      collectionForm.instance().updateFieldInCollection(2, null);
      expect(collectionForm.state('collection').fields[2]).toEqual(fields[3]);
      expect(_.map(collectionForm.state('collection').fields, 'name')).not.toContain(fields[2].name);
    });
  });
});
