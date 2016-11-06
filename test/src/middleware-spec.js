const _ = require('lodash');
const middleware = require('src/server/routes/middleware');
const models = require('lib/server/models');
const { generateToken } = require('lib/common');

describe("middleware", () => {

  let req = {}, res = {}, next;
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
      const err = 'No matching document';
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(null);
          return stub('catch');
        }
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ err });
    });

    it("sends back a 403 if there is no session token", () => {
      const err = 'No session token was provided';
      delete req.session.token;

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ err });
    });

    it("logs caught errors", () => {
      const err = 'something is wrong';
      Session.findByToken = jest.fn(() => ({
        then: () => ({
          catch: cb => cb(err)
        })
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err });
    });

  });

  describe("#registerUser", () => {

    beforeEach(() => {
      const json = stub('json');
      const body = {
        username: 'test_user',
        password: 'test_pass'
      };

      ({ User } = models);
      _.assign(req, { body });
      _.assign(res, json);
      next = jest.fn();
    });

    it("registers a new user and calls next", () => {
      User.register = jest.fn((username, password, cb) => cb(null));

      middleware.registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("sends errors to the client", () => {
      const err = 'you cant do that';
      User.register = jest.fn(() => res.json({ err }));

      middleware.registerUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ err });
    });
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
