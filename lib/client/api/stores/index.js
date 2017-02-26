import { createConnector } from 'cartiv';
import UserStore from './UserStore';
import getCollectionStore from './getCollectionStore';

const connect = createConnector(React);

export { connect };
export { UserStore };
export { getCollectionStore };
