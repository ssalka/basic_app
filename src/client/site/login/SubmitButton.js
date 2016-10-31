import React from 'react';
const { BaseComponent } = require('lib/client/components');
const _ = require('lodash');

module.exports = ({ text, style }) => (
  <button type="submit" style={style}>
    {text}
  </button>
);
