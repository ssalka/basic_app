const modulesToExport = [
  'IconSelector',
  'NavBar',
  'SchemaForm',
  'SideBar'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
