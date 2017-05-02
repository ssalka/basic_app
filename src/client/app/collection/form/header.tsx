declare const _;
declare const React;

import { ViewComponent, FlexRow, IconSelector } from 'lib/client/components';
import { Collection } from 'lib/client/interfaces';
import { CollectionNameInput, DescriptionTextarea } from './components';

interface IProps {
  collection: Partial<Collection>;
  handleChange(updates: Partial<Collection>): void;
}

interface IState {
  selectingIcon: boolean;
}

export default class SchemaFormHeader extends ViewComponent<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    collection: new Collection({
      name: '',
      description: '',
      icon: 'graph'
    })
  };

  state = {
    selectingIcon: false
  };

  toggleIconPopover() {
    this._toggle('selectingIcon');
  }

  public handleUpdateField(field: string): (value: string) => void {
    return value => this.props.handleChange({ [field]: value });
  }

  public render() {
    const { collection } = this.props;
    const { selectingIcon } = this.state;

    return (
      <div className="header">
        <FlexRow>
          <CollectionNameInput
            name={collection.name}
            handleChange={this.handleUpdateField('name')}
          />

          <IconSelector
            selectedIcon={collection.icon}
            onSelectIcon={this.handleUpdateField('icon')}
            onClick={this.toggleIconPopover}
            isOpen={selectingIcon}
          />
        </FlexRow>

        <DescriptionTextarea
          description={collection.description}
          handleChange={this.handleUpdateField('description')}
        />
      </div>
    );
  }
}
