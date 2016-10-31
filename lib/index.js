const modulesToRequire = [
  'server',
  'common'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
