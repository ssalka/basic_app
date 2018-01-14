import * as lodash from 'lodash';
import * as inflection from 'lodash-inflection';
import * as React from 'react';
import Link from 'react-router-redux-dom-link';
import { NonIdealState, IconName } from '@blueprintjs/core';
import { Icon, FlexRow, Button } from 'lib/client/components';
import { Collection, IDocument, IComponentModule } from 'lib/common/interfaces';
const _: any = lodash.mixin(inflection);

export default function getComponents(
  collection: Collection,
  documents: IDocument[] = []
): IComponentModule {
  const { name, description, icon, path } = collection;
  const linkWithState = (pathname: string) => ({
    pathname,
    state: { collection }
  });

  const SettingsButton = () => (
    <Link to={linkWithState(`${path}/edit`)}>
      <Button icon="cog" minimal={true} size="small" />
    </Link>
  );

  const AddDocumentButton = (overrides: any) => (
    <Link to={linkWithState(`${location.pathname}/add`)}>
      <Button
        icon="add"
        text={`Add ${_.singularize(name)}`}
        color="primary"
        minimal={true}
        rounded={true}
        {...overrides}
      />
    </Link>
  );

  return {
    CollectionHeader: () => (
      <FlexRow alignItems="top">
        <div className="collection-info">
          <h3>{name}</h3> <h3 className="muted">({documents.length})</h3>
          {description && <p>{description}</p>}
          <AddDocumentButton size="small" />
          <SettingsButton />
        </div>
        <Icon className="faded" name={icon} size={60} />
      </FlexRow>
    ),
    Placeholder: () => (
      <NonIdealState
        visual={(icon || 'document') as IconName}
        title={`You don't have any ${name}`}
        description={<span>All {name.toLowerCase()} you add will be visible here</span>}
        action={<AddDocumentButton />}
      />
    )
  };
}
