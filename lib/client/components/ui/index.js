const modulesToExport = [
  'IconSelector',
  'NavBar',
  'SideBar'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
