const _ = require('lodash');

const logLevels = ['log', 'info', 'debug', 'warn', 'error'];
const logUtils = ['memory', 'timeStamp', 'time', 'timeEnd', 'count', 'clear'];

module.exports = _.pick(console, [
  ...logLevels,
  ...logUtils // NOTE: only time and timeEnd are supported in node
]);
