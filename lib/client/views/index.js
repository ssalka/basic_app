const modulesToExport = [
  'CollectionView',
  'DocumentForm',
  'DocumentView',
  'SchemaForm',
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
