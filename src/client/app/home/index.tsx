declare const _;
declare const React;
import { NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router';
import { User } from 'lib/client/api';
import { connect, UserStore } from 'lib/client/api/stores';
import { ViewComponent, FlexRow, FlexColumn, Button } from 'lib/client/components';
import { Collection, ReactElement } from 'lib/common/interfaces';
import './styles.less';
import 'lib/client/styles/list-view-1.less';

@connect(UserStore)
class Home extends ViewComponent<any, any> {
  addView() {
    // TODO
    console.log('open a new view');
  }

  AddButton(props): ReactElement {
    return (
      <Link to={props.href}>
        <Button icon="add" minimal={true} rounded={true} {..._.omit(props, 'href')} />
      </Link>
    );
  }

  renderCollections(collections: Collection[] = []) {
    const description: string = 'Use Collections to describe and organize your data. Import or sync with any source.';
    const { AddButton } = this;

    return (
      <div className="pt-callout pt-elevation-1">
        {collections.length ? (
          <div>
            <FlexRow>
              <h4>Collections <span className="muted">({collections.length})</span></h4>
              <AddButton href="collections/add" />
            </FlexRow>
            <div className="scroll-y container">
              {collections.map((collection: Collection, key: number) => (
                <p><Link to={collection.path} key={key}>{collection.name}</Link></p>
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
            <div className="scroll-y container">
              {views.map((view, key: number) => (
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
}

export default Home;
