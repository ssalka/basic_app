import assert from 'assert';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import CollectionFormHeader from 'src/client/app/collection/form/header';


describe("CollectionFormHeader", () => {
  const testCollection = new MockCollection({ _id: true });
  let formHeader;
  let handleChange;

  function getCollectionFormHeader(context) {
    return mount(
      <CollectionFormHeader
        collection={testCollection}
        handleChange={handleChange}
      />,
      { context }
    );
  }

  function targetValue(value) {
    return { target: { value } };
  }

  let nameElement, descriptionElement, iconElement;
  beforeEach(() => {
    formHeader = getCollectionFormHeader();
    nameElement = formHeader.find('h3 .pt-editable-text');
    descriptionElement = formHeader.find('.description .pt-editable-text');
    iconElement = formHeader.find('.pt-popover-target .icon');
    handleChange = jest.fn(updates => formHeader.setProps({
      collection: _.assign(testCollection, updates)
    }));
  });

  it("displays the name and description of the collection", () => {
    assert(nameElement.exists(), "Collection name wasn't rendered");
    assert(descriptionElement.exists(), "Collection description wasn't rendered");
    expect(nameElement.text()).toBe(testCollection.name);
    expect(descriptionElement.text()).toBe(testCollection.description);
  });

  it("displays the collection's icon", () => {
    assert(iconElement.exists());
    expect(iconElement.prop('className')).toContain(`pt-icon-${testCollection.icon}`);
  });

  it("updates the collection name", () => {
    const newName = 'New Collection Name';

    nameElement
      .simulate('focus')
      .find('input')
      .simulate('change', targetValue(newName));

    expect(nameElement.text()).toBe(newName);
  });

  it("updates the collection description", () => {
    const newDescription = 'Updated collection description';

    descriptionElement
      .simulate('focus')
      .find('textarea')
      .simulate('change', targetValue(newDescription));

    expect(descriptionElement.find('textarea').text()).toBe(newDescription);
  });

  xit("updates the collection icon", () => {
    // TODO - how to access popover content?
    // (rendered in a separate react-root element)
  });
});
