const modulesToRequire = [
  'ModelGen',
  'types'
];

modulesToRequire.forEach(
  (module) => exports[module] = require(`./${module}`)
);
