const modulesToRequire = [
  'request',
  'logger'
];


modulesToRequire.forEach(
  module => exports[module] = require(`./${module}`)
);
