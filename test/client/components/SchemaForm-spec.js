import { mount } from 'enzyme';
import { FIELD_TYPES } from 'lib/common/constants';
import { MockCollection } from 'lib/server/models/mocks';
import { SchemaForm } from 'src/client/app/collection/form';


describe("SchemaForm", () => {
  let schemaForm;
  const testCollection = new MockCollection();

  function getSchemaForm(context) {
    return mount(<SchemaForm collection={testCollection} />, { context });
  }

  beforeEach(() => {
    schemaForm = getSchemaForm();
  });

  describe("Header", () => {
    it("displays the name and description of the collection", () => {
      expect(schemaForm.find('h3 .pt-editable-text').text()).toBe(testCollection.name);
      expect(schemaForm.find('.description .pt-editable-text').text()).toBe(testCollection.description);
    });
  });

  describe("Fields", () => {
    let fields;
    beforeEach(() => {
      fields = schemaForm.find('.field');
      expect(fields.length).toBe(testCollection.fields.length);
    });

    testCollection.fields.forEach((field, i) => {
      it(`displays the right text for field ${i+1}`, () => {
        const element = fields.at(i);

        expect(element.find('.pt-editable-text').first().text()).toBe(
          testCollection.fields[i].name
        );

        expect(element.find('.pt-popover-target .pt-button').first().text()).toBe(
          _.find(FIELD_TYPES.STANDARD, { key: testCollection.fields[i].type }).name
        );
      });

      it(`renders the checkboxes for field ${i+1}`, done => {
        const element = fields.at(i);
        element.find('.pt-icon-more').simulate('click');

        setTimeout(() => {
          const checkboxes = element.find('.pt-checkbox');
          expect(checkboxes.getNodes().length).toBe(2);
          expect(checkboxes.first().text()).toBe('Required');
          expect(checkboxes.last().text()).toBe('Is Array');
          done();
        });
      });
    });

  });
});
