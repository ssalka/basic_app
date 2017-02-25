const modulesToRequire = [
  'Collection',
  'Session',
  'User',
  'View'
];

modulesToRequire.forEach(
  (module) => exports[module] = require(`./${module}`)
);
