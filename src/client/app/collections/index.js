import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';
import { AddCollectionView } from 'lib/client/views';

const connect = createConnector(React);

@connect(UserStore)
class Collections extends ViewComponent {
  state = {
    currentView: 'default'
  }

  views = {
    addCollection: () => <AddCollectionView />
  }

  getCollections() {
    return _.get(this.state, 'user.library.collections', []);
  }

  getCurrentView() {
    const name = this.state.currentView;
    return _.get(this.views, name, this.renderCollections);
  }

  addCollection() {
    this.setState({
      currentView: 'addCollection'
    });
  }

  renderCollections() {
    const collections = this.getCollections();
    const addButton = (
      <Button className="pt-minimal pt-intent-primary"
        onClick={this.addCollection}
        iconName="add"
        text="Add Collection"
      />
    );

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <div className="flex-row">
              <a className="pt-button pt-minimal pt-icon-add"
                onClick={this.addCollection}
                tabIndex="0" role="button"
              ></a>
            </div>
            <div className="scroll container">
              {collections.map((collection, key) => (
                <p key={key}>{collection.name}</p>
              ))}
            </div>
          </div>
        ) : (
          <NonIdealState
            visual="graph"
            title="You don't have any Collections"
            description={(
              <span>
                Use Collections to describe and organize your data.
                Import or sync with any source.
              </span>
            )}
            action={addButton}
          />
        )}
      </div>
    );
  }

  render() {
    const CurrentView = this.getCurrentView();

    return (
      <section id="home" className="container">
        <div className="flex-row">
          <h2 className="view-title">
            Collections
          </h2>
        </div>
        <div className="flex-column">
          <CurrentView />
        </div>
      </section>
    );
  }
};

module.exports = Collections;
