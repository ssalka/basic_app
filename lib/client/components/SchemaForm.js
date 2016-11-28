import React from 'react';
import { ViewComponent } from '../components';

class SchemaForm extends ViewComponent {
  handleSubmit() {
    // validate & send to server via graphql
  }

  render() {
    console.log('render SchemaForm');
    return (
      <form onSubmit={this.handleSubmit}>
        Schema Form
      </form>
    );
  }
}

module.exports = SchemaForm;
