import _ from 'lodash';
import { request } from 'lib/common';

class GraphQL {
  request = request;

  toQueryString(query, method = 'query') {
    return encodeURIComponent(
      `${method} { ${query} }`.replace(/\s\s+/g, ' ')
    );
  }

  query(query, options = {}) {
    return this.exec(query, options);
  }

  mutation(query, options = {}) {
    options.mutation = true;
    return this.exec(query, options);
  }

  exec(query, options) {
    const method = options.mutation ? 'mutation' : 'query';
    const uri = `http://localhost:3000/graphql?query=${this.toQueryString(query, method)}`;

    return request.get(uri)
      .then(results => {
        if (options.log) console.log(results.body.data);
        return results.body.data;
      });
  }
}

const graphql = new GraphQL();

export default graphql;
