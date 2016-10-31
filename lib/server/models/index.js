const modulesToRequire = [
  'User',
  'Session'
];

modulesToRequire.forEach(
  (module) => exports[module] = require(`./${module}`)
);
