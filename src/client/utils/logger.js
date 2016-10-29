const _ = require('lodash');

Object.assign(exports,
  _.pick(console, [
    // Log Levels
    'log', 'info', 'debug', 'warn', 'error',

    // Log Utils
    'memory', 'timeStamp', 'time', 'timeEnd', 'count', 'clear'
  ])
);
