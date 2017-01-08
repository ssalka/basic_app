import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';
import _ from 'lodash';
_.mixin(require('lodash-inflection'));

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, FlexColumn, Button } from 'lib/client/components';
import './styles.less';
import 'lib/client/styles/list-view-1.less';

const connect = createConnector(React);

@connect(UserStore)
class Home extends ViewComponent {
  addView() {
    // TODO
    console.log("open a new view");
  }

  AddButton(props) {
    return (
      <Link to={props.href}>
        <Button icon="add" minimal={true} rounded={true} {..._.omit(props, 'href')} />
      </Link>
    );
  }

  renderCollections(collections = []) {
    const description = 'Use Collections to describe and organize your data. Import or sync with any source.';
    const { AddButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <FlexRow>
              <h4>Collections <span className="muted">({collections.length})</span></h4>
              <AddButton href="collections/add" />
            </FlexRow>
            <div className="scroll container">
              {collections.map((collection, key) => (
                <p><Link to={`collections${collection.path}`} key={key}>{collection.name}</Link></p>
              ))}
            </div>
          </div>
        ) : (
          <NonIdealState
            visual="graph"
            title="You don't have any Collections"
            description={<span>{description}</span>}
            action={(
              <AddButton
                text="Add Collection"
                href="collections/add"
                color="primary"
              />
            )}
          />
        )}
      </div>
    );
  }

  renderViews(views = []) {
    const description = 'Views allows you to define new visual representations of your data.';
    const { AddButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {views.length ? (
          <div>
            <FlexRow>
              <h4>Views <span className="muted">({views.length})</span></h4>
              <AddButton onClick={this.addView} />
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
            action={(
              <AddButton
                text="Add View"
                onClick={this.addView}
                color="primary"
              />
            )}
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
