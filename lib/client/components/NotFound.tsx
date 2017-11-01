import * as React from 'react';
import ViewComponent from './ViewComponent';

export default ({ match }) => (
  <ViewComponent>
    <h2>Not found: {match.params.param}</h2>
  </ViewComponent>
);
