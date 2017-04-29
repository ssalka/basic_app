declare const _;
declare const React;

import { ViewComponent, FlexRow, IconSelector } from 'lib/client/components';
import { Collection } from 'lib/client/interfaces';
import { ReactProps, IComponentModule, IFunctionModule } from 'lib/client/interfaces/react';
import * as handlers from './handlers';
import * as components from './components';

interface IProps extends ReactProps {
  collection: Partial<Collection>;
  handleChange?(updates: Partial<Collection>): void;
}

interface IState {
  selectingIcon: boolean;
}

export default class SchemaFormHeader extends ViewComponent<IProps, IState> {
  public static defaultProps: IProps = {
    collection: new Collection({
      name: '',
      description: '',
      icon: 'graph'
    })
  };

  state = {
    selectingIcon: false
  };

  private handlers: IFunctionModule = this.bindModule(
    _.pick(handlers, ['toggleIconPopover', 'selectIcon'])
  );

  private components: IComponentModule = this.bindModule(
    _.pick(components, ['CollectionNameInput', 'DescriptionTextarea'])
  );

  public render() {
    const {
      props: {
        collection
      },
      state: {
        selectingIcon
      },
      handlers: {
        toggleIconPopover,
        selectIcon
      },
      components: {
        CollectionNameInput,
        DescriptionTextarea
      }
    } = this;

    const handleUpdateName = (name: string) => (
      console.log('name', name) || this.props.handleChange({ name })
    );

    const handleUpdateIcon = (icon: string) => (
      this.props.handleChange({ icon })
    );

    const handleUpdateDescription = (description: string) => (
      this.props.handleChange({ description })
    );

    return (
      <div className="header">
        <FlexRow>
          <CollectionNameInput name={collection.name} handleChange={handleUpdateName} />
          <IconSelector
            selectedIcon={collection.icon}
            onSelectIcon={handleUpdateIcon}
            onClick={toggleIconPopover}
            isOpen={selectingIcon}
          />
        </FlexRow>
        <DescriptionTextarea description={collection.description} handleChange={handleUpdateDescription} />
      </div>
    );
  }
}
