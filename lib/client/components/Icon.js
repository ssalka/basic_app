module.exports = ({name, size = 24}) => (
  <span className={`glyphicon glyphicon-${name}`}
    style={{ fontSize: size }}
  ></span>
);
