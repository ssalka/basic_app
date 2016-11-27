import _ from 'lodash';
import { request } from 'lib/common';

class GraphQL {
  request = request;

  minify(method, selection) {
    return `${method} { ${selection} }`.replace(/\s\s+/g, ' ');
  }

  query(selection, options = {}) {
    return this.exec(selection, options);
  }

  mutation(selection, options = {}) {
    options.mutation = true;
    return this.exec(selection, options);
  }

  exec(selection, options) {
    const method = options.mutation ? 'mutation' : 'query';

    return request.post('/graphql', {
      query: this.minify(method, selection)
    })
      .then(results => {
        if (options.log) console.log(results.body.data);
        return results.body.data;
      });
  }
}

const graphql = new GraphQL();

export default graphql;
