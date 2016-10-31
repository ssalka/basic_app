const modulesToRequire = [
  'db',
  'models',
  'ModelGen'
];

modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
