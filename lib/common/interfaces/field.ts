import * as _ from 'lodash';

export interface IKeyValueField<K = any, V = any> {
  key: K;
  value: V;
}

/**
 * Field example generic usage:
 *  Field<{ key: string; }>
 *  Field<{ value: number; }>
 *  Field<{ key: Date; value: Event; }>
 */

export class Field<KV extends Partial<IKeyValueField> = {}>
  implements Partial<IKeyValueField> {
  key?: KV['key'];
  value?: KV['value'];

  constructor({ key, value }: Partial<KV> = {}) {
    if (!_.isUndefined(key)) {
      this.key = key;
    }
    if (!_.isUndefined(value)) {
      this.value = value;
    }
  }
}
