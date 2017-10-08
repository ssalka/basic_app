import * as _ from 'lodash';
import * as React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { connect, UserStore } from 'lib/client/api/stores';
import {
  ViewComponent,
  FlexRow,
  FlexColumn,
  Button
} from 'lib/client/components';
import { Collection, ReactElement } from 'lib/common/interfaces';

@connect(UserStore)
class Collections extends ViewComponent<any, any> {
  get collections(): Collection[] {
    return _.get(this.state, 'user.library.collections', []);
  }

  AddCollectionButton(props): ReactElement {
    return (
      <Link to="collections/add">
        <Button icon="add" minimal={true} rounded={true} {...props} />
      </Link>
    );
  }

  CollectionList(): ReactElement {
    const { collections, AddCollectionButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <FlexRow>
              <AddCollectionButton />
            </FlexRow>
            <div className="scroll-y container">
              {collections.map((collection: Collection, key: number) => (
                <p key={key}>{collection.name}</p>
              ))}
            </div>
          </div>
        ) : (
          <NonIdealState
            visual="graph"
            title="You don't have any Collections"
            description={
              <span>
                Use Collections to describe and organize your data. Import or
                sync with any source.
              </span>
            }
            action={
              <AddCollectionButton text="Add Collection" color="primary" />
            }
          />
        )}
      </div>
    );
  }

  render() {
    const { CollectionList } = this;

    return (
      <section id="collections" className="container list-view">
        <FlexRow>
          <h2 className="view-title">Collections</h2>
        </FlexRow>
        <FlexColumn>
          <CollectionList />
        </FlexColumn>
      </section>
    );
  }
}

export default Collections;
