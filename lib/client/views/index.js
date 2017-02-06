const modulesToExport = [
  'SchemaFormView',
  'CollectionView'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
