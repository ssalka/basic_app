const modulesToRequire = [
  'types'
];

modulesToRequire.forEach(
  (module) => exports[module] = require(`./${module}`)
);
