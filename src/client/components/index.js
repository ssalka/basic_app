const modulesToExport = ['BaseComponent', 'ViewComponent'];

modulesToExport.forEach(module => {
  exports[module] = require(`./${module}`);
});
