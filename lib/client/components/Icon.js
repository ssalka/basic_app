module.exports = ({name, size = 20, className, ...props}) => (
  <span className={[className, 'icon', `pt-icon-${name}`].join(' ')}
    style={{ fontSize: size }}
    {...props}
  ></span>
);
