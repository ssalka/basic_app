import assert from 'assert';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import CollectionFormSchema from 'src/client/app/collection/form/schema';


describe("CollectionFormSchema", () => {
  const testCollection = new MockCollection({ _id: true });
  const elements = {};
  let formSchema, addFieldRow, actionButtons;
  let handleChange;

  function getCollectionFormSchema(context) {
    return mount(<CollectionFormSchema collection={testCollection} />, { context });
  }

  beforeEach(() => {
    formSchema = getCollectionFormSchema();
    addFieldRow = formSchema.find('.minimal-row');
  });

  it("loads with the right initial state", () => {
    expect(formSchema.state()).toEqual({
      editingFields: false,
      showFieldOptions: testCollection.fields.map(_.stubFalse)
    });
  });

  describe("Subheader Row", () => {
    let subheaderRow;
    beforeEach(() => {
      subheaderRow = formSchema.find('.subheader');
      assert(subheaderRow.exists());
    });

    it("displays 'Schema' and an edit button", () => {
      expect(subheaderRow.find('h5').text()).toBe('Schema');
      expect(subheaderRow.find('button').prop('className')).toContain('pt-icon-edit');
    });

    it("toggles the `editingFields` state and updates the button", () => {
      const button = subheaderRow.find('button');
      const showFieldOptions = formSchema.state('showFieldOptions');

      button.simulate('click');
      assert(formSchema.state('editingFields'));
      expect(button.prop('className')).toContain('pt-icon-tick');
      expect(formSchema.state('showFieldOptions')).toEqual(showFieldOptions.map(_.stubFalse));

      button.simulate('click');
      assert(!formSchema.state('editingFields'));
      expect(button.prop('className')).toContain('pt-icon-edit');
      expect(formSchema.state('showFieldOptions')).toEqual(showFieldOptions);
    });
  });

  describe("Fields", () => {
    let fields;
    beforeEach(() => {
      fields = formSchema.find('.field');
      assert.equal(
        fields.length,
        testCollection.fields.length,
        'incorrect number of field elements'
      );
    });

    it("displays each field's name and type", () => {
      testCollection.fields.forEach((field, i) => {
        const element = fields.at(i);

        expect(element.find('.pt-editable-text').first().text()).toBe(
          testCollection.fields[i].name
        );

        expect(element.find('.pt-popover-target .pt-button').first().text()).toBe(
          _.find(FIELD_TYPES.STANDARD, { key: testCollection.fields[i].type }).name
        );
      });
    });

    it("expands the field options drawer", () => {
      testCollection.fields.forEach((field, i) => {
        const element = fields.at(i);
        element.find('button.pt-icon-more').simulate('click');

        const showFieldOptions = testCollection.fields.map(_.stubFalse);
        showFieldOptions[i] = true;

        expect(formSchema.state('showFieldOptions')).toEqual(showFieldOptions);
      });
    });

    describe("Field Options", () => {
      beforeEach(() => {
        // open all field options drawers
        formSchema.setState({
          showFieldOptions: testCollection.fields.map(_.stubTrue)
        });
      });

      it("renders the checkboxes for each field", () => {
        testCollection.fields.forEach((field, i) => {
          const element = fields.at(i);

          const checkboxes = element.find('.pt-checkbox');
          expect(checkboxes.length).toBe(2);

          expect(checkboxes.first().text()).toBe('Required');
          expect(checkboxes.first().find('input').get(0).checked).toBe(field.required);

          expect(checkboxes.last().text()).toBe('Is Array');
          expect(checkboxes.last().find('input').get(0).checked).toBe(field.isArray);
        });
      });

      xit("displays the field render method");
    });

    xdescribe("Add Field Row");
  });
});
