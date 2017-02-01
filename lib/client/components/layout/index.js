const modulesToExport = [
  'FlexColumn',
  'FlexRow',
  'Table'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
