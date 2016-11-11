const modulesToExport = [
  // Abstract Components
  'BaseComponent',
  'ViewComponent',

  // UI Components
  'NavBar'
];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
