const folders = {
  '.': [
    'BaseComponent',
    'ViewComponent',
    'Button',
    'Icon',
    'Popover'
  ],
  layout: [
    'FlexRow',
    'FlexColumn',
    'Table'
  ],
  ui: [
    'IconSelector',
    'NavBar',
    'SideBar'
  ]
};

_.forEach(folders, (components, folder) => components.forEach(
  component => folder === '.'
    ? exports[component] = require(`./${component}`)
    : exports[component] = require(`./${folder}/${component}`)
));
