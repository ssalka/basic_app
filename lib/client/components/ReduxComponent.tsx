import { IReduxProps } from 'lib/common/interfaces';
import ViewComponent from './ViewComponent';

export class ReduxComponent<P = {}, S = {}> extends ViewComponent<IReduxProps & P, S> {}
