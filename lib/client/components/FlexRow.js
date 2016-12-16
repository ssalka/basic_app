module.exports = ({
  className = '',
  classNames = [],
  ...props
}) => {
  props.className = classNames.concat(className, 'flex-row').join(' ');
  return <div {...props}></div>;
};
