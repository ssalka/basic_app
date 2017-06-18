import * as _ from 'lodash';
import * as middleware from 'src/server/routes/middleware';
import * as models from 'lib/server/models';
import generateToken = require('lib/common/generateToken');
import { Collection as ICollection, User as IUser } from 'lib/client/interfaces';

describe("middleware", () => {
  let req: Record<string, any>;
  let res: Record<string, any>;
  let next: (err?) => void;
  let Session;
  let User;

  beforeEach(() => {
    req = {}; res = {};
  });

  describe("#findUserByToken", () => {

    const user: Partial<IUser> = { username: 'test_user' };
    const session = { user, token: generateToken() };

    beforeEach(() => {
      const json = jest.fn();
      const status = jest.fn().mockReturnValue(res);

      ({ Session, User } = models);
      _.assign(req, _.cloneDeep({ session }));
      _.assign(res, { json, status });
    });

    it("finds the session and returns the user", () => {
      Session.findByToken = jest.fn(() => ({
        exec: cb => cb(null, session)
      }));

      User.findById = jest.fn(() => ({
        exec: cb => cb(null, user)
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it("sends an error if no session is found", () => {
      const err = 'No matching document';
      Session.findByToken = jest.fn(() => ({
        exec: cb => cb(null, null)
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
        exec: cb => cb(err)
      }));

      middleware.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err });
    });

  });

  describe("#registerUser", () => {

    beforeEach(() => {
      const json = jest.fn();
      const body = {
        username: 'test_user',
        password: 'test_pass'
      };

      ({ User } = models);
      _.assign(req, { body });
      _.assign(res, { json });
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

  describe("#startSession", () => {

    let session;
    const user: Partial<IUser> = {
      _id: 'userId',
      username: 'test_user'
    };

    beforeEach(() => {
      ({ Session } = models);
      Session.create = jest.fn((sess, cb) => {
        session = _.pick(sess, ['user', 'token']);
        cb(null, sess);
      });

      _.assign(req, { session: {}, user });
      next = jest.fn();
    });

    it("inserts a new session into the database", () => {
      middleware.startSession(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    it("sets the user and session token on req.session", () => {
      middleware.startSession(req, res, next);

      expect(req.session).toEqual(session);
    });

  });

  describe("#loginSuccess", () => {

    const session = {
      token: generateToken()
    };
    const user: Partial<IUser> = {
      _id: 'userId',
      username: 'test_user'
    };

    beforeEach(() => {
      const json = jest.fn();
      _.assign(req, { session, user });
      _.assign(res, { json });
    });

    it("sends the user and session token to the client", () => {
      middleware.loginSuccess(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toEqual({
        user, token: session.token
      });
    });

  });

  describe("#closeSession", () => {

    let session = {};

    beforeEach(() => {
      ({ Session } = models);

      _.assign(session, {
        token: generateToken(),
        remove: jest.fn(cb => cb())
      });
      _.assign(req, _.cloneDeep({ session }));

      req.session.destroy = jest.fn(cb => cb());
      next = jest.fn();
    });

    it("finds the session and closes it", () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(session);

          return this;
        },
        catch: jest.fn()
      }));

      middleware.closeSession(req, res, next);

      expect(session.remove).toHaveBeenCalled();
      expect(req.session.destroy).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    it("calls next if no session is found", () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(null);

          return this;
        },
        catch: jest.fn()
      }));

      middleware.closeSession(req, res, next);

      expect(next).toHaveBeenCalledWith('Session not found');
    });

    it("sends caught errors to the client", () => {
      const err = 'could not close session';
      Session.findByToken = jest.fn(() => ({
        then() { return this; },
        catch: cb => cb(err)
      }));

      _.assign(res, {
        status: jest.fn(() => res),
        json: jest.fn()
      });

      middleware.closeSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err });
    });

  });

  describe("#logout", () => {

    beforeEach(() => {
      _.assign(req, {
        user: { username: 'test_user' },
        logout() { delete req.user; }
      });

      res.json = jest.fn();
    });

    it("logs the user out", () => {
      middleware.logout(req, res);

      expect(req.user).toBeUndefined();
    });

    it("sends the username back to the client", () => {
      const { username } = req.user;

      middleware.logout(req, res);

      expect(res.json.mock.calls[0][0]).toEqual({ username });
    });

  });

});
