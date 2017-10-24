import * as _ from 'lodash';
import { Flex } from 'grid-styled';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Link from 'react-router-redux-dom-link';
import { NonIdealState } from '@blueprintjs/core';
import {
  ReduxComponent,
  FlexRow,
  FlexColumn,
  Button,
  ListView
} from 'lib/client/components';
import { Collection, ReactElement } from 'lib/common/interfaces';
import './styles.less';

const AddButton = ({ href = '', ...props }) => (
  <Link to={href}>
    <Button icon="add" minimal={true} rounded={true} {...props} />
  </Link>
);

export default class Home extends ReduxComponent<RouteComponentProps<any>> {
  addView() {
    // TODO
    console.log('open a new view');
  }

  renderCollections(collections: Collection[] = []) {
    const description: string =
      'Use Collections to describe and organize your data. Import or sync with any source.';

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <FlexRow>
              <h4>
                Collections <span className="muted">({collections.length})</span>
              </h4>
              <AddButton href="collections/add" />
            </FlexRow>

            <ListView
              items={collections}
              keys={{
                primary: 'name',
                link: 'path'
              }}
              style={{
                maxHeight: 200,
                paddingLeft: 20,
                overflowY: 'auto'
              }}
            />
          </div>
        ) : (
          <NonIdealState
            visual="graph"
            title="You don't have any Collections"
            description={<span>{description}</span>}
            action={
              <AddButton text="Add Collection" href="collections/add" color="primary" />
            }
          />
        )}
      </div>
    );
  }

  renderViews(views = []) {
    const description =
      'Views allows you to define new visual representations of your data.';

    return (
      <div className="pt-callout pt-elevation-1">
        {views.length ? (
          <div>
            <FlexRow>
              <h4>
                Views <span className="muted">({views.length})</span>
              </h4>
              <AddButton onClick={this.addView} />
            </FlexRow>
            <div className="scroll-y container">
              {views.map((view, key: number) => <p key={key}>{view.name}</p>)}
            </div>
          </div>
        ) : (
          <NonIdealState
            visual="page-layout"
            title="You don't have any Views"
            description={<span>{description}</span>}
            action={<AddButton text="Add View" onClick={this.addView} color="primary" />}
          />
        )}
      </div>
    );
  }

  render() {
    const { collections, views } = _.get(this.props.store.user, 'user.library', {
      collections: [],
      views: []
    });

    return (
      <Flex column={true} id="home" className="container list-view">
        <FlexRow>
          <h2 className="view-title">Library</h2>
        </FlexRow>
        <Flex column={true} align="stretch" justify="center">
          {this.renderCollections(collections)}
          {this.renderViews(views)}
        </Flex>
      </Flex>
    );
  }
}
