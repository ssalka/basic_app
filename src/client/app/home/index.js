import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, FlexColumn } from 'lib/client/components';
import './styles.less';
import 'lib/client/styles/list-view-1.less';

const connect = createConnector(React);

@connect(UserStore)
class Home extends ViewComponent {
  addCollection() {
    this.props.history.push('/collections/add');
  }

  addView() {
    // TODO
    console.log("open a new view");
  }

  renderCollections(collections = []) {
    const description = 'Use Collections to describe and organize your data. Import or sync with any source.';
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
            <FlexRow>
              <h4>Collections <span className="muted">({collections.length})</span></h4>
              <a className="pt-button pt-minimal pt-icon-add"
                onClick={this.addCollection}
                tabIndex="0" role="button"
              ></a>
            </FlexRow>
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
            description={<span>{description}</span>}
            action={addButton}
          />
        )}
      </div>
    );
  }

  renderViews(views = []) {
    const description = 'Views allows you to define new visual representations of your data.';
    const addButton = (
      <Button className="pt-minimal pt-intent-primary"
        onClick={this.addView}
        iconName="add"
        text="Add View"
      />
    );

    return (
      <div className="pt-callout pt-elevation-1">
        {views.length ? (
          <div>
            <FlexRow>
              <h4>Views <span className="muted">({views.length})</span></h4>
              <a className="pt-button pt-minimal pt-icon-add"
                onClick={this.addView}
                tabIndex="0" role="button"
              ></a>
            </FlexRow>
            <div className="scroll container">
              {views.map((view, key) => (
                <p key={key}>{view.name}</p>
              ))}
            </div>
          </div>
        ) : (
          <NonIdealState
            visual="page-layout"
            title="You don't have any Views"
            description={<span>{description}</span>}
            action={addButton}
          />
        )}
      </div>
    );
  }

  render() {
    const { collections, views } = _.get(this.state, 'user.library', {});

    return (
      <section id="home" className="container list-view">
        <FlexRow>
          <h2 className="view-title">Library</h2>
        </FlexRow>
        <FlexColumn>
          {this.renderCollections(collections)}
          {this.renderViews(views)}
        </FlexColumn>
      </section>
    );
  }
};

module.exports = Home;
