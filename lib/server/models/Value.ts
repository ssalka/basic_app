import { ModelGen } from '../utils';

export default ModelGen.generateModel('Value', {
  name: {
    type: String,
    required: true
  }
});
