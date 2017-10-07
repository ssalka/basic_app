declare const _;
declare const React;

import { Link } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { ViewComponent, Table, FlexColumn } from 'lib/client/components';
import { Collection, IRouteProps, IComponentModule } from 'lib/common/interfaces';
import getComponents from './components';
import './styles.less';

export interface IProps extends IRouteProps {
  collection: Collection;
  store: any;
}

export interface IState {
  loading: boolean;
  documents: any[];
}

export default class CollectionView extends ViewComponent<IProps, IState> {
  state = {
    documents: [],
    loading: true
  };

  componentDidMount() {
    const { collection } = this.props;

    console.info(
      'User Collection', collection._id,
      _.omit(collection, '_id')
    );
  }

  getView(view) {
    const views = {
      TABLE: {
        component: Table,
        props: {
          className: 'flex-view scroll',
        }
      }
    };

    return views[view] || views.TABLE;
  }

  openDocument(doc) {
    const { collection, history }: Partial<IProps> = this.props;

    return history.push({
      pathname: `${collection.path}/${doc._id}`,
      state: { document: doc }
    });
  }

  render() {
    const { documents, loading }: IState = this.state;
    const { collection, location }: Partial<IProps> = this.props;
    const { CollectionHeader, Loading, Placeholder }: any = getComponents(this.props, this.state);
    const noDocuments: boolean = _.isEmpty(documents);
    const handleSelectDocument: React.MouseEventHandler<any>
      = (doc: object) => this.openDocument(doc);
    const {
      component: View,
      props: viewProps
    } = this.getView(collection.defaultView.type);

    return (
      <FlexColumn className="collection-view">
        <CollectionHeader />
        {loading ? <Loading /> : (
          noDocuments ? <Placeholder /> : (
            <div {...viewProps}>
              <View
                fields={collection.fields}
                records={documents}
                onSelectDocument={handleSelectDocument}
                pathname={location.pathname}
              />
            </div>
          )
        )}
      </FlexColumn>
    );
  }
}
