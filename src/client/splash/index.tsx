import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Splash extends React.Component<
  RouteComponentProps<any>,
  {}
> {
  render() {
    return (
      <div className="view">
        <div className="container">
          <h1>Welcome to {document.title}</h1>
        </div>
      </div>
    );
  }
}
