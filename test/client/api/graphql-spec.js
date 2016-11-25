const { default: graphql } = require('lib/client/api/graphql');
const _ = require('lodash');

fdescribe("GraphQL Request API", () => {

  const data = {
    users: [{
      username: "q",
      email: "abc@123.com"
    }, {
      username: "user2",
      email: null
    }]
  };

  graphql.request.get = jest.fn(uri => ({
    then(cb) {
      cb({ body: { data } });

      return {
        then(expect) {
          expect({ data });
        }
      };
    }
  }));

  it("encodes the query", () => {
    const qs = graphql.toQueryString(`
      users {
        username
        email
      }
    `);

    expect(qs).toEqual('query%20%7B%20users%20%7B%20username%20email%20%7D%20%7D');
  });

  it("executes the query", done => {
    graphql.query(`
      users {
        username
        email
      }
    `)
      .then(results => {
        expect(results).toEqual({ data });
        done();
      });
  });

});
