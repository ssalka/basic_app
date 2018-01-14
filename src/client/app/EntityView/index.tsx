import * as lodash from 'lodash';
import * as inflection from 'lodash-inflection';
import * as React from 'react';
const _: any = lodash.mixin(inflection);

import { ViewComponent } from 'lib/client/components';
import { getName } from 'lib/common/helpers';
import { Field, IAggregate, PopulatedEntityDocument } from 'lib/common/interfaces';
import './styles.less';

interface IProps {
  entity: PopulatedEntityDocument<IAggregate>;
}

export default class EntityView extends ViewComponent<IProps> {
  componentDidMount() {
    if (__DEV__) {
      const { entity } = this.props;
      console.info(entity._id, _.omit(entity, '_id'));
    }
  }

  renderField = (field: Field): JSX.Element => (
    <p key={field.key}>
      {field.key && <strong className="field-key">{getName(field.key)}</strong>}

      {field.value && getName(field.value)}
    </p>
  );

  render() {
    const { model, value } = this.props.entity.references[0];
    const [primaryField, ...fields] = value.fields;

    return (
      <ViewComponent className="entity-view">
        <h1>{getName(primaryField.value)}</h1>
        <h5 className="muted">{model}</h5>
        {fields.map(this.renderField)}
      </ViewComponent>
    );
  }
}
