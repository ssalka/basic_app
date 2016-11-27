import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';
import './styles.less';

const connect = createConnector(React);

@connect(UserStore)
class Home extends ViewComponent {
  componentDidMount() {
    User.getLibrary("581f60e5a3193e23932cd6eb");
  }

  addCollection() {
    // TODO
    console.log("show 'New Collection' form");
  }

  addView() {
    // TODO
    console.log("open a new view");
  }

  renderCollections(collections = []) {
    const description = 'Use Collections to organize your data.';
    const addButton = (
      <Button className="pt-minimal pt-intent-primary"
        onClick={this.addCollection}
        iconName="add"
        text="Add Collection"
      />
    );

    return (
      <div className="pt-callout scroll">
        {collections.length ? (
          <div>
            <div className="row header">
              <h4>Collections <span className="muted">({collections.length})</span></h4>
              <a className="pt-button pt-minimal pt-icon-add float-right"
                onClick={this.addCollection}
                tabIndex="0" role="button"
              ></a>
            </div>
            {collections.map((collection, key) => (
              <p key={key}>{collection.name}</p>
            ))}
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
      <div className="pt-callout">
        {views.length ? (
          <div>
            <div className="row header">
              <h4>Views <span className="muted">({views.length})</span></h4>
              <a className="pt-button pt-minimal pt-icon-add float-right"
                onClick={this.addView}
                tabIndex="0" role="button"
              ></a>
            </div>

            {views.map((view, key) => (
              <p key={key}>{view.name}</p>
            ))}
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
      <section id="home" className="container">
        <div className="flex-row">
          <h2 className="view-title">Library</h2>
        </div>
        <div className="full-height">
          {this.renderCollections(collections)}
          {this.renderViews(views)}
        </div>
      </section>
    );
  }
};

module.exports = Home;
