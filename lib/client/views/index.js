const modulesToExport = [
  'SchemaForm',
  'CollectionView'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
