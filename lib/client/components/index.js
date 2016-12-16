const modulesToExport = [
  // Abstract Components
  'BaseComponent',
  'ViewComponent',

  // UI Components
  'Button',
  'Icon',
  'NavBar',
  'SchemaForm',
  'SideBar'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
