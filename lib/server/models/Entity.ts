import { ModelGen, types } from '../utils';
const { ref } = types;

export default ModelGen.generateModel('Entity', {
  name: String,
  references: [
    {
      type: {
        type: String
      },
      value: ref('references.type')
    }
  ]
});
