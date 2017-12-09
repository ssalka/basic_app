import { ModelGen } from '../utils';

export default ModelGen.generateModel('Entity', {
  name: {
    type: String,
    required: true
  }
});
