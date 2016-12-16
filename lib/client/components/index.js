const modulesToExport = [
  // Abstract Components
  'BaseComponent',
  'ViewComponent',

  // Layout Components
  'FlexRow',
  'FlexColumn',

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
