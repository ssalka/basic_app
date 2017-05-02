import assert from 'assert';
import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { SchemaForm } from 'src/client/app/collection/form';


describe("SchemaForm", () => {
  const testCollection = new MockCollection({ _id: true });
  let schemaForm;
  let elements = {};

  function getSchemaForm(context) {
    return mount(<SchemaForm collection={testCollection} />, { context });
  }

  function targetValue(value) {
    return { target: { value } };
  }

  beforeEach(() => {
    schemaForm = getSchemaForm();
    elements.header = schemaForm.find('.header');
    elements.schema = schemaForm.find('.form-main');
    elements.addFieldRow = schemaForm.find('.minimal-row');
    elements.actionButtons = schemaForm.find('.action-buttons');
  });

  it("loads with the right initial state", () => {
    expect(schemaForm.state()).toEqual({
      collection: testCollection,
      collections: [testCollection]
    });
  });

  it("renders each section", () => {
    _.forEach(elements, element => assert(element.exists()));
  });

  describe("Header", () => {
    let nameElement, descriptionElement, iconElement;
    beforeEach(() => {
      nameElement = elements.header.find('h3 .pt-editable-text');
      descriptionElement = elements.header.find('.description .pt-editable-text');
      iconElement = elements.header.find('.pt-popover-target .icon');
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
      expect(schemaForm.state('collection').name).toBe(newName);
    });

    it("updates the collection description", () => {
      const newDescription = 'Updated collection description';

      descriptionElement
        .simulate('focus')
        .find('textarea')
        .simulate('change', targetValue(newDescription));

      expect(descriptionElement.find('textarea').text()).toBe(newDescription);
      expect(schemaForm.state('collection').description).toBe(newDescription);
    });

    xit("updates the collection icon", () => {
      // TODO - how to access popover content?
      // (rendered in a separate react-root element)
    });
  });

  // TODO: Test CollectionFormSchema component separately
  // these tests are broken because the schema component now manages some of the state
  describe("Schema", () => {

    describe("Subheader Row", () => {
      let subheaderRow;
      beforeEach(() => {
        subheaderRow = elements.schema.find('.subheader');
        assert(subheaderRow.exists());
      });

      it("displays 'Schema' and an edit button", () => {
        expect(subheaderRow.find('h5').text()).toBe('Schema');
        expect(subheaderRow.find('button').prop('className')).toContain('pt-icon-edit');
      });

      it("toggles the `editingFields` state and updates the button", () => {
        const button = subheaderRow.find('button');
        const showFieldOptions = schemaForm.state('showFieldOptions');

        button.simulate('click');
        assert(schemaForm.state('editingFields'));
        expect(button.prop('className')).toContain('pt-icon-tick');
        expect(schemaForm.state('showFieldOptions')).toEqual(showFieldOptions.map(_.stubFalse));

        button.simulate('click');
        assert(!schemaForm.state('editingFields'));
        expect(button.prop('className')).toContain('pt-icon-edit');
        expect(schemaForm.state('showFieldOptions')).toEqual(showFieldOptions);
      });
    });

    describe("Fields", () => {
      let fields;
      beforeEach(() => {
        fields = elements.schema.find('.field');
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

          expect(schemaForm.state('showFieldOptions')).toEqual(showFieldOptions);
        });
      });

      describe("Field Options", () => {
        beforeEach(() => {
          // open all field options drawers
          schemaForm.setState({
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
    });
  });
});
