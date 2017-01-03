const modulesToExport = [
  'AddCollectionView',
  'CollectionView'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
