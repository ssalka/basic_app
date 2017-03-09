import { createAPI } from 'cartiv';
const api = createAPI();
const { User } = api;

export default api;
export { User }; // BUG: User api is initially undefined; need to grab off of api object
