import React from 'react';

module.exports = ({name, size = 20, ...props}) => (
  <span className={`icon pt-icon-${name}`}
    style={{ fontSize: size }}
    {...props}
  ></span>
);
