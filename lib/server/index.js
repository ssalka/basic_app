const modulesToRequire = [
  'db',
  'graphql',
  'models',
  'utils'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
