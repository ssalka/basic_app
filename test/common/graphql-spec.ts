import {
  getGraphQLCollectionType,
  getGraphQLField,
  getGraphQLArgument,
  getGraphQLVariable,
  getGraphQLSelectionSet
} from 'lib/common/graphql';
import { Field } from 'lib/client/interfaces/collection';

const fields = [{
  name: 'Boolean Field',
  type: 'BOOLEAN',
  renderMethod: 'PLAIN_TEXT',
  required: false,
  isArray: false
}, {
  name: 'String Field',
  type: 'STRING',
  renderMethod: 'PLAIN_TEXT',
  required: false,
  isArray: false
}, {
  name: 'Date Field',
  type: 'DATETIME',
  renderMethod: 'PLAIN_TEXT',
  required: false,
  isArray: false
}, {
  name: 'Rating Field',
  type: 'NUMBER',
  renderMethod: 'RATING',
  required: false,
  isArray: false
}, {
  name: 'Array Field',
  type: 'STRING',
  renderMethod: 'PLAIN_TEXT',
  required: false,
  isArray: true
}, {
  name: 'badly-formed_field ',
  type: 'STRING',
  renderMethod: 'RATING',
  required: true,
  isArray: true
}];

describe('getGraphQLCollectionType', () => {
  it('formats the type of a collection or field for GraphQL', () => {
    const expectedTypes = [
      'BooleanField',
      'StringField',
      'DateField',
      'RatingField',
      'ArrayField',
      'BadlyFormedField'
    ];

    _(fields)
      .map(getGraphQLCollectionType)
      .zipWith(expectedTypes)
      .forEach(([graphQLField, expectedGraphQLField]) => {
        expect(graphQLField).toBe(expectedGraphQLField);
      });
  });
});

describe('getGraphQLField', () => {
  it('generates a field type argument', () => {
    const expectedFields = [
      'booleanField: Boolean',
      'stringField: String',
      'dateField: Date',
      'ratingField: Float',
      'arrayField: [String]',
      'badlyFormedField: [String]'
    ];

    _(fields)
      .map(getGraphQLField)
      .zipWith(expectedFields)
      .forEach(([graphQLField, expectedGraphQLField]) => {
        expect(graphQLField).toBe(expectedGraphQLField);
      });
  });
});

describe('getGraphQLArgument', () => {
  it('generates an argument for a GraphQL query/mutation', () => {
    const expectedArguments = [
      'booleanField: $booleanField',
      'stringField: $stringField',
      'dateField: $dateField',
      'ratingField: $ratingField',
      'arrayField: $arrayField',
      'badlyFormedField: $badlyFormedField'
    ];

    _(fields)
      .map(getGraphQLArgument)
      .zipWith(expectedArguments)
      .forEach(([graphQLArgument, expectedGraphQLArgument]) => {
        expect(graphQLArgument).toBe(expectedGraphQLArgument);
      });
  });
});

describe('getGraphQLVariable', () => {
  it('generates an argument for a GraphQL query/mutation declaration', () => {
    const expectedVariables = [
      '$booleanField: Boolean',
      '$stringField: String',
      '$dateField: Date',
      '$ratingField: Float',
      '$arrayField: [String]',
      '$badlyFormedField: [String]'
    ];

    _(fields)
      .map(getGraphQLVariable)
      .zipWith(expectedVariables)
      .forEach(([graphQLVariable, expectedGraphQLVariable]) => {
        expect(graphQLVariable).toBe(expectedGraphQLVariable);
      });
  });
});

describe('getGraphQLSelectionSet', () => {
  it('generates a selection set for a query', () => {
    expect(getGraphQLSelectionSet(fields)).toBe(
      '__typename\n_id\nbooleanField\nstringField\ndateField\nratingField\narrayField\nbadlyFormedField'
    );
  });
});
