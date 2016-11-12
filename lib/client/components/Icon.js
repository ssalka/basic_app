module.exports = ({name, size = 24, ...props}) => (
  <span className={`glyphicon glyphicon-${name}`}
    style={{ fontSize: size }}
    {...props}
  ></span>
);
