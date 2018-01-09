export const systemDbName = process.env.NODE_ENV
  .replace('production', 'appname')
  .replace('development', 'dev');

export const collectionsDbName = systemDbName + '_collections';

// TODO set up production db
const mongoBaseUrl = 'mongodb://localhost:27017/';

export const appMongoURI = mongoBaseUrl + systemDbName;

export const collectionsMongoURI = mongoBaseUrl + collectionsDbName;
