import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { UserStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, FlexColumn, Button } from 'lib/client/components';

const connect = createConnector(React);

@connect(UserStore)
class Collections extends ViewComponent {
  get collections() {
    return _.get(this.state, 'user.library.collections', []);
  }

  AddCollectionButton(props) {
    return (
      <Link to="collections/add">
        <Button icon="add" minimal={true} rounded={true} {...props} />
      </Link>
    );
  }

  CollectionList() {
    const { collections, AddCollectionButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <FlexRow><AddCollectionButton /></FlexRow>
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
            action={(
              <AddCollectionButton
                text="Add Collection"
                color="primary"
              />
            )}
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
          <h2 className="view-title">
            Collections
          </h2>
        </FlexRow>
        <FlexColumn>
          <CollectionList />
        </FlexColumn>
      </section>
    );
  }
};

module.exports = Collections;
