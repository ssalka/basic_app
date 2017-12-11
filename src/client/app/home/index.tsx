import * as _ from 'lodash';
import { Flex } from 'grid-styled';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Link from 'react-router-redux-dom-link';
import { EditableText, NonIdealState } from '@blueprintjs/core';
import {
  ReduxComponent,
  FlexRow,
  FlexColumn,
  Button,
  ListView
} from 'lib/client/components';
import { Collection, ReactElement } from 'lib/common/interfaces';
import SmartInput from 'lib/client/components/ui/SmartInput';
import './styles.less';

const AddButton = ({ href = '', ...props }) => (
  <Link to={href}>
    <Button icon="add" minimal={true} rounded={true} {...props} />
  </Link>
);

export default class Home extends ReduxComponent<RouteComponentProps<any>> {
  actions = _.pick(this.props.actions, ['createEntity', 'getEntities']);

  componentDidMount() {
    if (_.isEmpty(this.props.store.entity.entities)) {
      this.props.actions.getEntities();
    }
  }

  addView() {
    // TODO
    console.log('open a new view');
  }

  renderCollections(collections: Collection[] = []) {
    const description: string =
      'Use Collections to describe and organize your data. Import or sync with any source.';

    return (
      <div className="collections pt-callout pt-elevation-1">
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
              pl={20}
              style={{
                maxHeight: 200,
                overflow: 'auto'
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
      <div className="views pt-callout pt-elevation-1">
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
      <div id="home" className="container">
        <h2 className="title">Library</h2>

        <SmartInput
          collections={collections}
          inputStyle={{ width: '100%' }}
          actions={this.actions}
        />

        <div className="entities pt-callout pt-elevation-1">
          {this.props.store.entity.entities.map(({ _id, name }, i) => (
            <EditableText
              key={i}
              placeholder="New Entity"
              value={name}
              onChange={console.log}
            />
          ))}
        </div>

        {this.renderCollections(collections)}
        {this.renderViews(views)}
      </div>
    );
  }
}
