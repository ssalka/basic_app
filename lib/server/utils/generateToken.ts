import { randomBytes } from 'crypto';

export default () => randomBytes(64).toString('hex');
