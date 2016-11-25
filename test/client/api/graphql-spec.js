const { default: graphql } = require('lib/client/api/graphql');
const _ = require('lodash');

describe("GraphQL Request API", () => {

  const users = [
    { username: "q", email: "abc@123.com" },
    { username: "user2", email: null }
  ];

  const mockRequest = data => graphql.request.get = jest.fn(uri => ({
    then(cb) {
      cb({ body: { data } });

      return {
        then(expect) {
          expect(data);
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
    mockRequest({ users });

    graphql.query(`
      users {
        username
        email
      }
    `)
      .then(response => {
        expect(response).toEqual({ users });
        done();
      });
  });

  it("handles queries with parameters", done => {
    mockRequest({ user: users[0] });

    graphql.query(`
      user(id: "the_users_id") {
        username
        email
      }
    `)
      .then(response => {
        expect(response).toEqual({ user: users[0] });
        done();
      });
  });

});
