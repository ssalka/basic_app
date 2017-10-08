declare const _;
declare const React;
import { Link } from 'react-router-dom';
import { NonIdealState, IconName } from '@blueprintjs/core';
import { Icon, FlexRow, Button } from 'lib/client/components';
import { IComponentModule } from 'lib/common/interfaces';
import { IProps, IState } from './';

export default function getComponents(
  { collection, location: _location }: IProps,
  { documents }: IState
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
    <Link to={linkWithState(`${_location.pathname}/add`)}>
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
          <p>
            <h3>{name}</h3>{' '}
            <h3 className="muted">({_.get(documents, 'length', 0)})</h3>
          </p>
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
        description={
          <span>All {name.toLowerCase()} you add will be visible here</span>
        }
        action={<AddDocumentButton />}
      />
    ),
    Loading: () => (
      <FlexRow className="flex-view" justifyContent="center">
        <div className="loader" />
      </FlexRow>
    )
  };
}
