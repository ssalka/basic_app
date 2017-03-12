declare const _;
declare const React;

import { Link } from 'react-router';
import { NonIdealState } from '@blueprintjs/core';
import { ViewComponent, Table, FlexColumn } from 'lib/client/components';
import { Collection, IRouteProps, IQueryProps, IComponentModule } from 'lib/client/interfaces';
import getComponents from './components';
import 'lib/client/styles/CollectionView.less';

export interface IProps extends IRouteProps, IQueryProps {
  collection: Collection;
  documents: any[];
  loading: boolean;
  store: any;
}

export interface IState {
  documents: any[];
}

export default class CollectionView extends ViewComponent<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    collection: {} as Collection,
    loading: true
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      documents: props.documents || []
    };
  }

  private componentDidMount() {
    const { collection } = this.props;

    console.info(
      'User Collection', collection._id,
      _.omit(collection, '_id')
    );
  }

  private componentWillReceiveProps(nextProps: IProps) {
    const { collection, store } = nextProps;
    if (!_.isEqual(nextProps.documents, this.state.documents)) {
      // TODO: warn if overwriting unsaved changes
      store.loadDocuments(nextProps.documents);
    }
  }

  private getView(view) {
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

  private openDocument(doc) {
    const { collection, history }: Partial<IProps> = this.props;
    return history.push({
      pathname: `${collection.path}/${doc._id}`,
      state: { document: doc }
    });
  }

  public render() {
    const { collection, loading, loadNextPage, location }: Partial<IProps> = this.props;
    const { CollectionHeader, Loading, Placeholder }: any = getComponents(this.props, this.state);
    const noDocuments: boolean = _.isEmpty(this.state.documents);
    const handleLoadNextPage: React.MouseEventHandler<any> = () => loadNextPage();
    const handleSelectDocument: React.MouseEventHandler<any> = (doc: object) => this.openDocument(doc);
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
              <div onClick={handleLoadNextPage}>Load Next Page</div>
              <View
                headers={_.map(collection.fields, 'name')}
                content={this.state.documents}
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
