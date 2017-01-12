const modulesToRequire = [
  'constants',
  'generateToken',
  'helpers',
  'logger',
  'request'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
