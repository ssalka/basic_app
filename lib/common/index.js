const modulesToRequire = [
  'constants',
  'generateToken',
  'logger',
  'request'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
