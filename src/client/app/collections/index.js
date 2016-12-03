import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { UserStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';

const connect = createConnector(React);

@connect(UserStore)
class Collections extends ViewComponent {
  get collections() {
    return _.get(this.state, 'user.library.collections', []);
  }

  AddCollectionButton({minimal}) {
    return minimal ? (
      <Link to="collections/add" role="button"
        className="pt-button pt-minimal pt-icon-add"
      ></Link>
    ) : (
      <Link to="collections/add">
        <Button className="pt-minimal pt-intent-primary"
          iconName="add" text="Add Collection"
        />
      </Link>
    );
  }

  CollectionList() {
    const { collections, AddCollectionButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <div className="flex-row">
              <AddCollectionButton minimal={true} />
            </div>
            <div className="scroll container">
              {collections.map((collection, key) => (
                <p key={key}>{collection.name}</p>
              ))}
            </div>
          </div>
        ) : (
          <NonIdealState visual="graph"
            title="You don't have any Collections"
            description={(
              <span>
                Use Collections to describe and organize your data.
                Import or sync with any source.
              </span>
            )}
            action={<AddCollectionButton />}
          />
        )}
      </div>
    );
  }

  render() {
    const { CollectionList } = this;
    return (
      <section id="collections" className="container list-view">
        <div className="flex-row">
          <h2 className="view-title">
            Collections
          </h2>
        </div>
        <div className="flex-column">
          <CollectionList />
        </div>
      </section>
    );
  }
};

module.exports = Collections;
