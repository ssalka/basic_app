const modulesToRequire = [
  'Collection',
  'Session',
  'User',
  'View',
  'mocks'
];

modulesToRequire.forEach(
  (module) => exports[module] = require(`./${module}`)
);
