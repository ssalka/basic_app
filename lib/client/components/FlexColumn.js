module.exports = ({
  className = '',
  classNames = [],
  style = {},
  justifyContent = 'space-between',
  alignItems = 'stretch',
  wrap = false,
  ...props
}) => {
  props.className = classNames.concat(className, 'flex-column').join(' ');
  props.style = _.assign(style, {
    justifyContent, alignItems, 'flex-wrap': wrap ? 'wrap' : 'nowrap'
  });
  return <div {...props}></div>;
};
