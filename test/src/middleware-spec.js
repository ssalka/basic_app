const _ = require('lodash');
const middleware = require('src/server/routes/middleware');
const models = require('lib/server/models');
const { generateToken } = require('lib/common');

describe("middleware", () => {

  let req = {}, res = {}, next = () => {};
  let Session, User;

  describe("#findUserByToken", () => {

    const token = generateToken();
    const user = { username: 'test_user' };
    const session = { user, token };

    beforeEach(() => {
      const json = stub('json');
      const status = stub('status', json);
      ({ Session, User } = models);

      _.assign(req, _.cloneDeep({ session }));
      _.assign(res, json, status);
    });

    it("finds the session and returns the user", () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(session);
          return stub('catch');
        }
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it("sends an error if no session is found", () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(null);
          return stub('catch');
        }
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        err: 'No matching document'
      });
    });

    it("sends back a 403 if there is no session token", () => {
      delete req.session.token;

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        err: 'No session token was provided'
      });
    });

    it("logs caught errors", () => {
      Session.findByToken = jest.fn(() => ({
        then: () => ({
          catch: cb => cb('something is wrong')
        })
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        err: 'something is wrong'
      });
    });

  });

  describe("#registerUser", () => {
    it("registers a new user and calls next");
    it("sends errors to the client");
  });

  describe("#loginUser", () => {
    it("authenticates the user");
    it("rejects invalid login credentials");
  });

  describe("#startSession", () => {
    it("inserts a new session into the database");
    it("sets the user and session token on req.session");
    it("calls next");
  });

  describe("#loginSuccess", () => {
    it("sends the user and session token to the client");
  });

  describe("#closeSession", () => {
    it("finds the session and closes it");
    it("logs caught errors");
  });

  describe("#logout", () => {
    it("logs the user out");
    it("sends the username back to the client");
  });

  describe("#getUser", () => {
    it("sends the user to the client");
    it("sends an error if req.user is undefined");
  });

});

/**
 * Test Utils
 */

function stub(name, value) {
  const stub = jest.fn(() => value);
  return name ? { [name]: stub } : stub;
}
