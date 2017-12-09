import * as assert from 'assert';
import * as _ from 'lodash';
import * as React from 'react';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { Collection } from 'lib/common/interfaces';
import { MockCollection } from 'lib/server/models/mocks';
import CollectionFormHeader from 'src/client/app/collectionForm/header';

describe('CollectionFormHeader', () => {
  const testCollection: Collection = new MockCollection();
  let formHeader;
  let handleChange;

  function getCollectionFormHeader() {
    return mount(
      <CollectionFormHeader collection={testCollection} handleChange={handleChange} />
    );
  }

  function targetValue(value) {
    return { target: { value } };
  }

  let nameElement;
  let descriptionElement;
  let iconElement;

  beforeEach(() => {
    formHeader = getCollectionFormHeader();
    nameElement = formHeader.find('h3 .pt-editable-text');
    descriptionElement = formHeader.find('.description .pt-editable-text');
    iconElement = formHeader.find('.pt-popover-target .icon');
    handleChange = jest.fn(updates =>
      formHeader.setProps({
        collection: _.assign(testCollection, updates)
      })
    );
  });

  it('displays the name and description of the collection', () => {
    assert(nameElement.exists(), "Collection name wasn't rendered");
    assert(descriptionElement.exists(), "Collection description wasn't rendered");
    expect(nameElement.text()).toBe(testCollection.name);
    expect(descriptionElement.text()).toBe(testCollection.description);
  });

  it("displays the collection's icon", () => {
    assert(iconElement.exists());
    expect(iconElement.prop('className')).toContain(`pt-icon-${testCollection.icon}`);
  });

  xit('updates the collection icon', () => {
    // TODO - how to access popover content?
    // (rendered in a separate react-root element)
  });
});
