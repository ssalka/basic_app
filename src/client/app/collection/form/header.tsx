declare const _;
declare const React;

import { ViewComponent, FlexRow, IconSelector } from 'lib/client/components';
import { Collection } from 'lib/client/interfaces';
import { CollectionNameInput, DescriptionTextarea } from './components';

interface IProps {
  collection: Partial<Collection>;
  handleChange(updates: Partial<Collection>): void;
}

export default class CollectionFormHeader extends ViewComponent<IProps> {
  static defaultProps: Partial<IProps> = {
    collection: new Collection({
      name: '',
      description: '',
      icon: 'graph'
    })
  };

  handleUpdateField(field: string): (value: string) => void {
    return value => this.props.handleChange({ [field]: value });
  }

  render() {
    const { collection } = this.props;

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
