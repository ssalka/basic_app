const modulesToExport = [
  // Abstract Components
  'BaseComponent',
  'ViewComponent',

  // UI Components
  'Icon',
  'NavBar',
  'SideBar'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
