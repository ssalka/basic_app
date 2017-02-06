import { createConnector } from 'cartiv';
import UserStore from './UserStore';

const connect = createConnector(React);

export { connect };
export { UserStore };
