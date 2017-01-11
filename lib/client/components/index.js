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
  'IconSelector',
  'NavBar',
  'Popover',
  'SchemaForm',
  'SideBar',
  'Table'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
