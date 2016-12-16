const modulesToExport = [
  'AddCollectionView'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
