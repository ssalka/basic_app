module.exports = ({
  className = '',
  classNames = [],
  ...props
}) => {
  props.className = classNames.concat(className, 'flex-column').join(' ');
  return <div {...props}></div>;
};
