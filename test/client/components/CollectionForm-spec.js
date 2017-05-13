import assert from 'assert';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { CollectionForm } from 'src/client/app/collection/form';


describe("CollectionForm", () => {
  const testCollection = new MockCollection({ _id: true });
  let collectionForm;
  let elements = {};

  function getCollectionForm(context) {
    return mount(<CollectionForm collection={testCollection} />, { context });
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
});
