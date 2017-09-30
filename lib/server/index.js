const modulesToRequire = [
  'db',
  'models',
  'utils'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
