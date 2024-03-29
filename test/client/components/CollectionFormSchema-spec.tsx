import * as assert from 'assert';
import * as _ from 'lodash';
import * as React from 'react';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import CollectionFormSchema from 'src/client/app/collectionForm/schema';

describe('CollectionFormSchema', () => {
  const testCollection = new MockCollection();
  const collections = [testCollection];

  let formSchema;
  let addFieldRow;
  let handleChange;

  function getCollectionFormSchema() {
    return mount(
      <CollectionFormSchema
        collection={testCollection}
        collections={collections}
        handleChange={handleChange}
      />
    );
  }

  beforeEach(() => {
    formSchema = getCollectionFormSchema();
    addFieldRow = formSchema.find('.minimal-row');
    handleChange = jest.fn();
  });

  it('loads with the right initial state', () => {
    expect(formSchema.state()).toEqual({
      editingFields: false,
      showFieldOptions: testCollection.fields.map(_.stubFalse)
    });
  });

  describe('Subheader Row', () => {
    let subheaderRow;
    beforeEach(() => {
      subheaderRow = formSchema.find('.subheader');
      assert(subheaderRow.exists());
    });

    it("displays 'Schema' and an edit button", () => {
      expect(subheaderRow.find('h5').text()).toBe('Schema');
      expect(subheaderRow.find('button').prop('className')).toContain('pt-icon-edit');
    });

    it('toggles the `editingFields` state and updates the button', () => {
      const button = subheaderRow.find('button');
      const showFieldOptions = formSchema.state('showFieldOptions');

      button.simulate('click');
      assert(formSchema.state('editingFields'));
      assert(formSchema.find('.subheader button').hasClass('pt-icon-tick'));
      expect(formSchema.state('showFieldOptions')).toEqual(
        showFieldOptions.map(_.stubFalse)
      );

      button.simulate('click');
      assert(!formSchema.state('editingFields'));
      assert(formSchema.find('.subheader button').hasClass('pt-icon-edit'));
      expect(formSchema.state('showFieldOptions')).toEqual(showFieldOptions);
    });
  });

  describe('Fields', () => {
    let fields;
    beforeEach(() => {
      fields = formSchema.find('.field');

      // BUG: enzyme seems to think there are twice as many field elements as there actually are
      /*assert.equal(
        fields.length,
        testCollection.fields.length,
        'incorrect number of field elements'
      );*/
    });

    it("displays each field's name and type", () => {
      // TODO: iterate over actual collection fields instead of enzyme wrappers (blocked by above bug)
      fields.forEach((element, i) => {
        const { name, type, _collection } = testCollection.fields.find(f =>
          element.text().includes(f.name)
        );

        const matchedType =
          _.find(FIELD_TYPES.STANDARD, { key: type }) ||
          _.find(collections, { _id: _collection });

        assert(matchedType, `no matched type for element ${i} (${name})`);

        const fieldName = element
          .find('.pt-editable-text')
          .first()
          .text();

        const fieldType = element
          .find('.pt-popover-target .pt-button')
          .first()
          .text();

        expect(fieldName).toBe(name);
        expect(fieldType).toBe(matchedType.name);
      });
    });

    describe('Field Options', () => {
      beforeEach(() => {
        // open all field options drawers
        formSchema.setState({
          showFieldOptions: testCollection.fields.map(_.stubTrue)
        });
      });

      xit('renders the checkboxes for each field', () => {
        testCollection.fields.forEach((field, i) => {
          const element = fields.at(i);

          const checkboxes = element.find('.pt-checkbox');
          expect(checkboxes.length).toBe(2);

          expect(checkboxes.first().text()).toBe('Required');
          expect(
            checkboxes
              .first()
              .find('input')
              .get(0).checked
          ).toBe(field.required);

          expect(checkboxes.last().text()).toBe('Is Array');
          expect(
            checkboxes
              .last()
              .find('input')
              .get(0).checked
          ).toBe(field.isArray);
        });
      });

      xit('displays the field render method');
    });

    describe('Option Button', () => {
      xit('expands the field options drawer', () => {
        testCollection.fields.forEach((field, i) => {
          const element = fields.at(i);
          element.find('button.pt-icon-more').simulate('click');

          const showFieldOptions = testCollection.fields.map(_.stubFalse);
          showFieldOptions[i] = true;

          expect(formSchema.state('showFieldOptions')).toEqual(showFieldOptions);
        });
      });
    });
  });

  describe('Add Field Row', () => {
    it('displays a button to add a field', () => {
      const addFieldButton = addFieldRow.find('button');
      assert(addFieldButton.exists());
      expect(addFieldButton.text()).toBe('Add Field');
    });

    it('adds an empty field to the schema when clicked', () => {
      const { fields } = formSchema.prop('collection');
      addFieldRow.find('button').simulate('click');
      expect(formSchema.prop('handleChange')).toHaveBeenCalledWith(fields.length);
    });
  });
});
