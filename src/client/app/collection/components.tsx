declare const _;
declare const React;
import { Link } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { Icon, FlexRow, Button } from 'lib/client/components';

export default function getComponents(props, state) {
  const { collection, location: _location } = props;
  const { documents } = state;
  const { name, description, icon, path } = collection;
  const linkWithState = pathname => ({
    pathname, state: { collection }
  });

  const SettingsButton = () => (
    <Link to={linkWithState(`${path}/edit`)}>
    <Button icon="cog" minimal={true} size="small" />
    </Link>
  );

  const AddDocumentButton = overrides => (
    <Link to={linkWithState(`${_location.pathname}/add`)}>
    <Button icon="add" text={`Add ${_.singularize(name)}`}
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
      <p><h3>{name}</h3> <h3 className="muted">({documents.length})</h3></p>
      {description && <p>{description}</p>}
      <AddDocumentButton size="small" />
      <SettingsButton />
      </div>
      <Icon className="faded" name={icon} size={60} />
      </FlexRow>
    ),
    Placeholder: () => (
      <NonIdealState
      visual={icon || 'document'}
      title={`You don't have any ${name}`}
      description={<span>All {name.toLowerCase()} you add will be visible here</span>}
      action={<AddDocumentButton />}
      />
    ),
    Loading: () => (
      <FlexRow className="flex-view" justifyContent="center">
      <div className="loader"></div>
      </FlexRow>
    )
  };
}
